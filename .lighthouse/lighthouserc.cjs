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
      numberOfRuns: 2,
      settings,
      chromeFlags: '--no-sandbox --disable-gpu',
    },
    assert: {
      assertions: {

        'categories:performance':     ['error', { minScore: 0.70 }],
        'categories:accessibility':   ['error', { minScore: 0.80 }],
        'categories:best-practices':  ['error', { minScore: 0.80 }],
        'categories:seo':             ['error', { minScore: 0.85 }],

        'first-contentful-paint':     ['error', { maxNumericValue: 2500, aggregationMethod: 'median' }],
        'largest-contentful-paint':   ['error', { maxNumericValue: 4000, aggregationMethod: 'median' }],
        'total-blocking-time':        ['error', { maxNumericValue: 300,  aggregationMethod: 'median' }],
        'cumulative-layout-shift':    ['error', { maxNumericValue: 0.10, aggregationMethod: 'median' }],
        'speed-index':                ['error', { maxNumericValue: 4300, aggregationMethod: 'median' }],

        'unused-javascript':          'error',
        'unused-css-rules':           'error',
        'legacy-javascript':          'error',
        'render-blocking-resources':  'error',
        'offscreen-images':           'error',
        'uses-responsive-images':     'error',

        'resource-summary':           'error',
        'uses-long-cache-ttl':        'error',
        'no-document-write':          'error',
      },
      budgetsFile: './.lighthouse/budget.json',
    },
  },
};
