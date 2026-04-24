new MutationObserver(mutations => {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      if (node.tagName === 'SHREDDIT-AD-POST') { node.remove(); continue; }
      node.querySelectorAll('shreddit-ad-post').forEach(el => el.remove());
    }
  }
}).observe(document.documentElement, { childList: true, subtree: true });
