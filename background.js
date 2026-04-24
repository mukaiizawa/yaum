import SCRIPT_METAS from './scripts/index.js';

const DISABLED_HOSTS_KEY = 'disabledHosts';
const ACTION_ICON_PATHS = {
  on: {
    16: 'icons/icon-on-16.png',
    32: 'icons/icon-on-32.png',
    48: 'icons/icon-on-48.png',
  },
  off: {
    16: 'icons/icon-off-16.png',
    32: 'icons/icon-off-32.png',
    48: 'icons/icon-off-48.png',
  },
};

async function loadScripts() {
  return Promise.all(
    SCRIPT_METAS.map(async meta => {
      const res = await fetch(chrome.runtime.getURL(meta.file));
      const code = await res.text();
      return { ...meta, code };
    })
  );
}

// urlPattern is always a JS regex string; inject guards for hostname and location.href.
function buildRegistration(script, disabledHosts) {
  const check = `if(!new RegExp(${JSON.stringify('^(?:' + script.urlPattern + ')$')}).test(location.href))return;`;
  const hostCheck = `if(${JSON.stringify(disabledHosts)}.includes(location.hostname))return;`;
  return {
    matches: ['<all_urls>'],
    code: `(function(){${hostCheck}${check}${script.code}})();`,
  };
}

async function getDisabledHosts() {
  const stored = await chrome.storage.local.get(DISABLED_HOSTS_KEY);
  return Array.isArray(stored[DISABLED_HOSTS_KEY]) ? stored[DISABLED_HOSTS_KEY] : [];
}

async function isHostEnabled(hostname) {
  const disabledHosts = await getDisabledHosts();
  return !disabledHosts.includes(hostname);
}

async function setHostEnabled(hostname, enabled) {
  const disabledHosts = await getDisabledHosts();
  const nextDisabledHosts = enabled
    ? disabledHosts.filter(host => host !== hostname)
    : [...new Set([...disabledHosts, hostname])];

  await chrome.storage.local.set({ [DISABLED_HOSTS_KEY]: nextDisabledHosts });
}

async function setActionIcon(tabId, enabled) {
  await chrome.action.setIcon({
    tabId,
    path: enabled ? ACTION_ICON_PATHS.on : ACTION_ICON_PATHS.off,
  });
}

async function updateAction({ enabled, tabId, hostname }) {
  const title = hostname
    ? `yaum: ${enabled ? 'ON' : 'OFF'} for ${hostname}`
    : `yaum: ${enabled ? 'ON' : 'OFF'}`;

  await setActionIcon(tabId, enabled);
  await chrome.action.setTitle({
    tabId,
    title,
  });
  await chrome.action.setBadgeText({
    tabId,
    text: '',
  });
}

async function syncUserScripts() {
  const disabledHosts = await getDisabledHosts();

  try {
    await chrome.userScripts.unregister();

    const scripts = await loadScripts();
    await chrome.userScripts.register(
      scripts.map((script, i) => {
        const { matches, code } = buildRegistration(script, disabledHosts);
        return {
          id: String(i),
          matches,
          js: [{ code }],
          runAt: script.runAt || 'document_idle',
          world: 'MAIN',
        };
      })
    );
  } catch (err) {
    throw new Error('[XScript] User scripts are not allowed. Enable "Allow user scripts" in chrome://extensions > Details.', { cause: err });
  }
}

function getTabHostname(tab) {
  if (!tab?.url) return null;

  try {
    const url = new URL(tab.url);
    return /^https?:$/.test(url.protocol) ? url.hostname : null;
  } catch {
    return null;
  }
}

async function refreshActionForTab(tabId) {
  if (!tabId) return;

  try {
    const tab = await chrome.tabs.get(tabId);
    const hostname = getTabHostname(tab);
    if (!hostname) {
      await setActionIcon(tabId, true);
      await chrome.action.setTitle({
        tabId,
        title: 'yaum: unavailable on this page',
      });
      await chrome.action.setBadgeText({ tabId, text: '' });
      return;
    }

    const enabled = await isHostEnabled(hostname);
    await updateAction({ enabled, tabId, hostname });
  } catch {
    // ignore tabs that are no longer available
  }
}

async function initialize() {
  await syncUserScripts();

  const tabs = await chrome.tabs.query({ active: true });
  await Promise.all(tabs.map(tab => refreshActionForTab(tab.id)));
}

initialize();

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  await refreshActionForTab(tabId);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    await refreshActionForTab(tabId);
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  const hostname = getTabHostname(tab);
  if (!hostname) return;

  const nextEnabled = !(await isHostEnabled(hostname));
  await setHostEnabled(hostname, nextEnabled);
  await updateAction({ enabled: nextEnabled, tabId: tab.id, hostname });
  await syncUserScripts();

  if (nextEnabled && tab?.id) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => location.reload(),
      });
    } catch {
      // ignore tabs where reload is not allowed (e.g. chrome:// pages)
    }
  }
});
