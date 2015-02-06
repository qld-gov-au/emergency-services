# Services Directory App

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Dependency Status](https://david-dm.org/qld-gov-au/emergency-services.png)](https://david-dm.org/qld-gov-au/emergency-services)

Single-page application for emergency services feed. This page is used on [Emergency services and safety](http://www.qld.gov.au/emergency/) pages.

## Requirements

This project assumes that you have node.js installed and the Bower along with the Grunt.js CLI also installed.

For more information about these two requirements, visit [Getting started](http://gruntjs.com/getting-started).

## Getting started

Navigate to your repo in the Command Prompt or Terminal and run the `npm install` command. This will download all the necessary npm modules and then follow with downloading the bower components.

Then, in Finder (OSX) or Explorer (Win) navigate to your repo and into the `cmd` folder. Then, double-click the `development.scpt` (OSX) or `development.cmd` (Win) file. This will open up a command line interface and kick-off the server where you will do most of your development.

This server will do an automatic refresh in your default browser if all the linting checks pass. It is a very handy way to develop apps. Alternatively, you can just run the `grunt serve` command and it will also start up the server for development.

## Development

With the development server running, watch tasks are instantiated. This means that changes you make to the HTML, SASS and Javascript files are automatically detected and the checking and compilation process are run. The process of watching and compiling will rapidly increase development times and improve code consistency as well.

Once you are happy with the application and want to deploy some development files for checking, simply run the `grunt build:stage` task. This will compile all the files in a state that is ready to be deployed to a server for user testing.

## Production

To build files for production, run the `grunt build:dist` task. This will compile and minify the files so you can deploy them to a production server.

## Testing with Protractor

To date, only end-to-end testing has been added to the build. This is conducted with Webdriver and Protractor and is based on the principles of Behaviour-Driven Development and Test-Driven Development. You can read more about that in this article, [Testing Your JavaScript with Jasmine](http://code.tutsplus.com/tutorials/testing-your-javascript-with-jasmine--net-21229). The syntax for Webdriver is very similar to Jasmine, so it is worth doing some further investigation into the concepts and methods for this framework.

Before you start writing and executing exceptions for tests, you need to run the `grunt webdriver` task. This will update the binaries required to run Webdriver in your repo. If you ever clone a new repo, you will have to repeat this step.

To get started with your development and testing in parallel, in Finder (OSX) or Explorer (Win) navigate to your repo and into the `cmd` folder. Then, double-click the `testing.scpt` (OSX) or `testing.cmd` (Win) file.

Running can be done by running `grunt testing:mac` (OSX) or `grunt testing:win` (Win). If you want to use BrowserStack, simply run `grunt testing:browserstack`. This can have issues with timeouts, etc so just keep trying until the connection is stable and all the tests pass.

To edit or create tests, add or update files under the `test/e2e` folder.

## Additional info

You may want to update your npm modules at some stage. To do so, use the following steps in the command line interface:

1. `npm install -g npm-check-updates`
2. `npm-check-updates -u`
3. `npm install`

This will ensure you are using the most up-to-date versions.
