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
    // No preset here — we assert strictly below.
    assert: {
      assertions: {
        // Fail if Lighthouse itself had problems
        'lighthouse-run-warnings': 'error',
        'runtime-error': 'error',

        // Category score gates (0..1). 0.70 means 70/100.
        'categories:performance':   ['error', { minScore: 0.70 }],
        'categories:accessibility': ['error', { minScore: 0.80 }],
        'categories:best-practices':['error', { minScore: 0.80 }],
        'categories:seo':           ['error', { minScore: 0.85 }],

        // Core Web Vitals thresholds (numeric)
        'first-contentful-paint':   ['error', { maxNumericValue: 2500, aggregationMethod: 'median' }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000, aggregationMethod: 'median' }],
        'total-blocking-time':      ['error', { maxNumericValue: 300,  aggregationMethod: 'median' }],
        'cumulative-layout-shift':  ['error', { maxNumericValue: 0.10, aggregationMethod: 'median' }],
        'speed-index':              ['error', { maxNumericValue: 4300, aggregationMethod: 'median' }],

        // Enforce budgets (requires budgetsFile below)
        'performance-budget': 'error',
      },
      budgetsFile: './.lighthouse/budget.json',
    },
    collect: {
      numberOfRuns: 1,
      settings,
      chromeFlags: '--no-sandbox --disable-gpu --no-zygote',
    },
  },
};
