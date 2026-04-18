import SCRIPT_METAS from './scripts/index.js';

async function loadScripts() {
  return Promise.all(
    SCRIPT_METAS.map(async meta => {
      const res = await fetch(chrome.runtime.getURL(meta.file));
      const code = await res.text();
      return { ...meta, code };
    })
  );
}

// urlPattern is always a JS regex string; inject a guard that tests location.href.
function buildRegistration(script) {
  const check = `if(!new RegExp(${JSON.stringify('^(?:' + script.urlPattern + ')$')}).test(location.href))return;`;
  return {
    matches: ['<all_urls>'],
    code: `(function(){${check}${script.code}})();`,
  };
}

async function syncUserScripts() {
  try {
    await chrome.userScripts.unregister();

    const scripts = await loadScripts();
    await chrome.userScripts.register(
      scripts.map((script, i) => {
        const { matches, code } = buildRegistration(script);
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

syncUserScripts();

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => alert('yaum: reloaded'),
    });
  } catch {
    // ignore tabs where scripting is not allowed (e.g. chrome:// pages)
  }
  chrome.runtime.reload();
});
