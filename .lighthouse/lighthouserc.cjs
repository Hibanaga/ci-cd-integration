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
      numberOfRuns: 1,
      settings,
      chromeFlags: '--no-sandbox --disable-gpu',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.50 }],
        'categories:accessibility': ['warn', { minScore: 0.50 }],
        'categories:best-practices': ['warn', { minScore: 0.50 }],
        'categories:seo': ['warn', { minScore: 0.50 }],

        'first-contentful-paint': ['warn', { maxNumericValue: 8000, aggregationMethod: 'median' }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000, aggregationMethod: 'median' }],
        'total-blocking-time': ['warn', { maxNumericValue: 900, aggregationMethod: 'median' }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.2, aggregationMethod: 'median' }],
        'speed-index': ['warn', { maxNumericValue: 8000, aggregationMethod: 'median' }],

        'unused-javascript': 'warn',
        'unused-css-rules': 'warn',
        'legacy-javascript': 'warn',
        'render-blocking-resources': 'warn',
        'offscreen-images': 'warn',
        'uses-responsive-images': 'warn',

        'resource-summary': 'error',
        'uses-long-cache-ttl': 'warn',
        'no-document-write': 'error',
      },
      budgetsFile: './.lighthouse/budget.json',
    },
  },
};
