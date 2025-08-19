// .lighthouse/lighthouserc.cjs
/** @type {import('@lhci/cli').LHCIConfig} */
const FORM_FACTOR = process.env.LHCI_FORM_FACTOR || 'mobile'; // 'mobile' | 'desktop'

const settings = {
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  emulatedFormFactor: FORM_FACTOR,
  disableStorageReset: false,
};

if (FORM_FACTOR === 'desktop') {
  settings.preset = 'desktop';
}

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings,
      chromeFlags: '--no-sandbox --disable-gpu',
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { "minScore": 0.50 }],
        "categories:accessibility": ["error", { "minScore": 0.50 }],
        "categories:best-practices": ["error", { "minScore": 0.50 }],
        "categories:seo": ["error", { "minScore": 0.50 }],

        "first-contentful-paint": ["warn", { "maxNumericValue": 8000, "aggregationMethod": "median" }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 4000, "aggregationMethod": "median" }],
        "total-blocking-time": ["warn", { "maxNumericValue": 900, "aggregationMethod": "median" }],
        "cumulative-layout-shift": ["warn", { "maxNumericValue": 0.2, "aggregationMethod": "median" }],
        "speed-index": ["warn", { "maxNumericValue": 8000, "aggregationMethod": "median" }],

        "unused-javascript": "error",
        "unused-css-rules": "error",
        "legacy-javascript": "error",
        "render-blocking-resources": "error",
        "offscreen-images": "error",
        "uses-responsive-images": "error",

        "resource-summary": "error",
        "uses-long-cache-ttl": "error",
        "no-document-write": "error"
      },
      budgetsFile: './.lighthouse/budget.json',
    },
  },
};
