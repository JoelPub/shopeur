var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
var SpecReporter = require('jasmine-spec-reporter');
var JasmineReporters = require('jasmine-reporters');
var config = require('./test/e2e/config');

exports.config = {
    framework: 'jasmine2',

    seleniumAddress: config.seleniumAddress,

    // see https://github.com/angular/protractor/blob/master/docs/timeouts.md
    // see https://github.com/angular/protractor/blob/74bc02f3f638bb5ad0e274bb25ebdf1b43d7d577/docs/faq.md
    allScriptsTimeout: 20000,

    suites: {
        'mandatory' : [
            'test/e2e/welcome/welcome.spec.js',
            'test/e2e/sign-up/sign-up.spec.js',
            'test/e2e/login/login.spec.js',
            'test/e2e/footer-menu/footer-menu.spec.js',
            'test/e2e/side-menu/side-menu.spec.js'
        ],
        'essential': [
            'test/e2e/profile/profile.spec.js',
            'test/e2e/edit-profile/edit-profile.spec.js',
            'test/e2e/product/product.spec.js',
            'test/e2e/wishlist/wishlist.spec.js',
            'test/e2e/trips/trips.spec.js',
            'test/e2e/trip/trip.spec.js'
        ],
        'optional' : [
            'test/e2e/settings/settings.spec.js'
        ]
    },

    onPrepare: function() {
        jasmine.getEnv().addReporter(
            new Jasmine2HtmlReporter({
                savePath: './test/reports/',
                takeScreenshots: true
            })
        );

        // add jasmine spec reporter
        var specReporter = new SpecReporter({
            displayStacktrace: 'all'
        });

        jasmine.getEnv().addReporter(specReporter);

        // add jasmine reporters
        var nUnitXmlReporter = new JasmineReporters.NUnitXmlReporter({
            savePath: './test/reports/',
            consolidateAll: false
        });

        jasmine.getEnv().addReporter(nUnitXmlReporter);
    },

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 45000,
        isVerbose : true,
        includeStackTrace : true,
        realtimeFailure: true
    },

    capabilities: {

        //'browserName': 'firefox'

        'browserName': 'chrome',
        'chromeOptions': {
            'args': [
                'window-size=412,732'
            ]
        }

    }
};
