const SELECTORS = [
  'div.top_leaderboard-odyssey-wrapper',
  "script[pubname='fandomcom']",
];

function removeElements(root) {
  for (const sel of SELECTORS) {
    root.querySelectorAll(sel).forEach(el => el.remove());
  }
}

removeElements(document);

new MutationObserver(mutations => {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      for (const sel of SELECTORS) {
        if (node.matches(sel)) { node.remove(); break; }
      }
      removeElements(node);
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });
