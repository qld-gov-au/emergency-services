var bsConfig = {
    'build': 'E2E Tests - ' + new Date().toISOString(),
    'project': 'Protractor',
    'debug': true,
    'user': 'kylierose2',
    'key': 'r9cBSaXLmXf331LQsYAd'
};

exports.config = {

    allScriptsTimeout: 55000,

    // Browserstack's selenium server address
    seleniumAddress: 'http://hub.browserstack.com/wd/hub',

    seleniumArgs: ['-Dwebdriver.browserstack.driver=./node_modules/browserstacklocal/win.exe r9cBSaXLmXf331LQsYAd localhost,9000,0'],

    // Pattern for finding test spec files
    specs: [
        '../e2e/*_spec.js'
    ],

    // Capabilities to be passed to the webdriver instance.
    multiCapabilities: [
        {
            'browserName': 'firefox',
            'os': 'Windows',
            'build': bsConfig.build,
            'project': bsConfig.project,
            'browserstack.debug': bsConfig.debug,
            'browserstack.tunnel': 'true',
            'browserstack.user': bsConfig.user,
            'browserstack.key': bsConfig.key,
            'browserstack.local' : 'true'
        },
        {
            'browserName': 'IE',
            'browser_version': '11.0',
            'os': 'Windows',
            'build': bsConfig.build,
            'project': bsConfig.project,
            'browserstack.debug': bsConfig.debug,
            'browserstack.tunnel': 'true',
            'browserstack.user': bsConfig.user,
            'browserstack.key': bsConfig.key
        },
        {
            'browserName': 'safari',
            'os': 'OS X',
            'build': bsConfig.build,
            'project': bsConfig.project,
            'browserstack.debug': bsConfig.debug,
            'browserstack.tunnel': 'true',
            'browserstack.user': bsConfig.user,
            'browserstack.key': bsConfig.key
        },
        {
            'browserName': 'chrome',
            'os': 'Windows',
            'build': bsConfig.build,
            'project': bsConfig.project,
            'browserstack.tunnel': bsConfig.debug,
            'browserstack.user': bsConfig.user,
            'browserstack.key': bsConfig.key
        },
        {
            'browserName': 'chrome',
            'os': 'OS X',
            'os_version': 'Mountain Lion',
            'build': bsConfig.build,
            'project': bsConfig.project,
            'browserstack.debug': bsConfig.debug,
            'browserstack.tunnel': 'true',
            'browserstack.user': bsConfig.user,
            'browserstack.key': bsConfig.key
        }
    ],

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