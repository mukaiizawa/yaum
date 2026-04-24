const SELECTOR = '#rise-interstitial-area';

function remove(root) {
  root.querySelectorAll(SELECTOR).forEach(el => el.remove());
}

remove(document);

new MutationObserver(mutations => {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (node.matches(SELECTOR)) { node.remove(); continue; }
      remove(node);
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });
