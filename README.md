# yaum

yaum stands for Yet Another Userscript Manager.

A Chrome extension that injects custom JavaScript into pages on load. Manage per-site scripts through a Tampermonkey-style UI for site customization and ad removal.

## Features

- Automatically inject scripts into pages matching URL patterns
- Add, edit, delete, and toggle scripts via a built-in options page
- Control execution timing: `document_start`, `document_end`, or `document_idle`
- URL patterns support both wildcard and regular expression syntax

## Installation

1. Clone or download this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select this directory
5. Click **Details** on the yaum card
6. Enable **Allow user scripts**

> Step 6 is required by Chrome for extensions that use the `userScripts` API (Chrome 120+).
> Without it, scripts will not be injected.

## Usage

1. Right-click the extension icon → **Options**
2. Click **+ Add new script**
3. Enter a name, URL pattern, and code, then click **Save**

### URL Pattern Syntax

| Pattern | Description | Example |
|---------|-------------|---------|
| `*://example.com/*` | Wildcard — `*` matches any string | `*://*.google.com/*` |
| `/regex/flags` | Regular expression wrapped in slashes | `/^https:\/\/example\.(com\|net)\//` |

### Script Examples

```js
// Hide ad elements
document.querySelectorAll('.ad, [class*="banner"], iframe').forEach(el => {
  el.style.display = 'none';
});
```

```js
// Force dark mode
document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
```

## File Structure

```
├── manifest.json   # Manifest V3 definition
├── background.js   # Service Worker (page monitoring & script injection)
├── storage.js      # CRUD operations via chrome.storage.local
├── match.js        # URL pattern matching
├── options.html    # Management UI
├── options.js      # Management UI logic
└── options.css     # Styles
```

## Icon Workflow

- Edit `icons/icon-on-128.png` and `icons/icon-off-128.png`
- Regenerate `16/32/48/128` variants with `Pillow`:

```bash
python -m pip install Pillow
python .\icons\generate_icons.py
```

## Requirements

- Google Chrome 120+ (`userScripts` API)

## License

MIT
