const FORM = process.env.LHCI_FORM_FACTOR === 'mobile' ? 'mobile' : 'desktop';
const PRESET = FORM;

module.exports = {
    ci: {
        collect: {
            numberOfRuns: 1,
            settings: {
                preset: PRESET,
                onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
                emulatedFormFactor: FORM,
                throttlingMethod: 'simulate',
                disableStorageReset: false,
            },
            chromeFlags: '--no-sandbox --disable-gpu',
        },
        assert: {
            assertions: {
                'categories:performance':   ['error', { minScore: 0.90 }],
                'categories:accessibility': ['error', { minScore: 0.90 }],
                'categories:best-practices':['error', { minScore: 0.90 }],
                'categories:seo':           ['error', { minScore: 0.90 }],

                'largest-contentful-paint': ['error', { maxNumericValue: 2500, aggregationMethod: 'median' }],
                'total-blocking-time':      ['error', { maxNumericValue: 200,  aggregationMethod: 'median' }],
                'cumulative-layout-shift':  ['error', { maxNumericValue: 0.10, aggregationMethod: 'median' }],

                'first-contentful-paint':   ['warn',  { maxNumericValue: 1800, aggregationMethod: 'median' }],
                'speed-index':              ['warn',  { maxNumericValue: 3400, aggregationMethod: 'median' }],

                'performance-budget': ['error', { aggregationMethod: 'median' }],
                'timing-budget':      ['error', { aggregationMethod: 'median' }],
                'resource-summary':   ['warn'],
                'third-party-summary':['warn'],

                'unused-javascript':         'warn',
                'unused-css-rules':          'warn',
                'legacy-javascript':         'warn',
                'render-blocking-resources': 'warn',
                'offscreen-images':          'warn',
                'uses-responsive-images':    'warn',
                'uses-long-cache-ttl':       'warn',
                'no-document-write':         'error',
            },
            budgetsFile: './.lighthouse/budget.json',
        },
    },
};
