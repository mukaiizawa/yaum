const AD_SELECTORS = [
  'ins.adsbygoogle',
  'iframe[src*="googlesyndication.com"]',
  'iframe[src*="doubleclick.net"]',
  'iframe[src*="googleadservices.com"]',
  'iframe[id^="google_ads_iframe"]',
  'iframe[data-google-container-id]',
  'div[id^="div-gpt-ad"]',
];

function removeAds(root) {
  for (const sel of AD_SELECTORS) {
    root.querySelectorAll(sel).forEach(el => el.remove());
  }
}

removeAds(document);

new MutationObserver(mutations => {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      for (const sel of AD_SELECTORS) {
        if (node.matches(sel)) { node.remove(); break; }
      }
      removeAds(node);
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });
