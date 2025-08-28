/** @type {import('@lhci/cli').AssertConfig} */
const assertions = {
  // Categories
  'categories:performance': ['error', { minScore: 0.50 }],
  'categories:accessibility': ['warn', { minScore: 0.50 }],
  'categories:best-practices': ['warn', { minScore: 0.50 }],
  'categories:seo': ['warn', { minScore: 0.50 }],

  // Core metrics — set to "error" to fail pipeline on breaches
  'first-contentful-paint': ['error', { maxNumericValue: 8000, aggregationMethod: 'median' }],
  'largest-contentful-paint': ['error', { maxNumericValue: 4000, aggregationMethod: 'median' }],
  'total-blocking-time': ['error', { maxNumericValue: 900, aggregationMethod: 'median' }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.2, aggregationMethod: 'median' }],
  'speed-index': ['error', { maxNumericValue: 8000, aggregationMethod: 'median' }],

  // Additional checks
  'unused-javascript': 'warn',
  'unused-css-rules': 'warn',
  'legacy-javascript': 'warn',
  'render-blocking-resources': 'warn',
  'offscreen-images': 'warn',
  'uses-responsive-images': 'warn',

  'resource-summary': 'error',
  'uses-long-cache-ttl': 'warn',
  'no-document-write': 'error',
};

const formFactor = process.env.LHCI_FORM_FACTOR === 'mobile' ? 'mobile' : 'desktop';

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      // Use LHCI_FORM_FACTOR to switch between desktop/mobile in matrix
      settings: {
        preset: formFactor,                 // 'desktop' or 'mobile'
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        // Do NOT hardcode emulatedFormFactor here; preset handles it.
        disableStorageReset: false,
      },
      chromeFlags: '--no-sandbox --disable-gpu',
    },
    assert: {
      assertions,
      budgetsFile: './.lighthouse/budget.json',
    },
  },
};
