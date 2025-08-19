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
      preset: "lighthouse:recommended",
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
      },
      budgetsFile: './.lighthouse/budget.json',
    },
  },
};