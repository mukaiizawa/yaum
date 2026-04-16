const SELECTOR = 'iframe[src^="https://sin.creativecdn.com/ad/"]';

function removeAds(root) {
  root.querySelectorAll(SELECTOR).forEach(el => el.remove());
}

removeAds(document);

new MutationObserver(mutations => {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (node.matches(SELECTOR)) { node.remove(); continue; }
      removeAds(node);
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });
