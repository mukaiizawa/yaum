export default [
  {
    name: 'Remove Google Ads',
    urlPattern: 'https?://.+',
    enabled: true,
    runAt: 'document_start',
    file: 'scripts/remove-google-ads.js',
  },
  {
    name: 'Fandom Cleanup',
    urlPattern: 'https?://([a-z0-9-]+\\.)?fandom\\.com/.*',
    enabled: true,
    runAt: 'document_start',
    file: 'scripts/fandom-cleanup.js',
  },
  {
    name: 'Remove CreativeCDN Ads',
    urlPattern: 'https?://.+',
    enabled: true,
    runAt: 'document_start',
    file: 'scripts/remove-creativecdn-ads.js',
  },
  {
    name: 'Remove ProfitX Ads',
    urlPattern: 'https?://.+',
    enabled: true,
    runAt: 'document_start',
    file: 'scripts/remove-profitx-ads.js',
  },
  {
    name: 'Remove Wikiwiki Interstitial',
    urlPattern: 'https://wikiwiki.jp/.*',
    enabled: true,
    runAt: 'document_start',
    file: 'scripts/remove-wikiwiki-interstitial.js',
  },
];
