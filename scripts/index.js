export default [
  {
    urlPattern: 'https?://.+',
    runAt: 'document_start',
    file: 'scripts/remove-google-ads.js',
  },
  {
    urlPattern: 'https?://([a-z0-9-]+\\.)?fandom\\.com/.*',
    runAt: 'document_start',
    file: 'scripts/fandom.js',
  },
  {
    urlPattern: 'https?://.+',
    runAt: 'document_start',
    file: 'scripts/remove-creativecdn-ads.js',
  },
  {
    urlPattern: 'https?://.+',
    runAt: 'document_start',
    file: 'scripts/remove-profitx-ads.js',
  },
  {
    urlPattern: 'https?://[^/]+\\.atwiki\\.jp/.*',
    runAt: 'document_start',
    file: 'scripts/atwiki.js',
  },
  {
    urlPattern: 'https://wikiwiki.jp/.*',
    runAt: 'document_start',
    file: 'scripts/wikiwiki.js',
  },
];
