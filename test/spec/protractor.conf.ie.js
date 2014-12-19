exports.config = {
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    seleniumArgs: ['-Dwebdriver.ie.driver=./node_modules/protractor/selenium/IEDriverServer.exe'],

    // Spec patterns are relative to the location of this config.
    specs: [
        '../e2e/*_spec.js'
    ],

    capabilities: {
        browserName: 'internet explorer'
    },


    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:8000',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 10000
    }
};
