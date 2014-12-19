'use strict';

describe('test interface', function () {
    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get('http://localhost:9000/emergency');
    });

    it('check the title', function () {
        var title = element(by.css('#content h1'));
        expect(title.getText()).toBe('Emergency services and safety');
    });

//    it('check the toggle', function () {
//        var form = element(by.css('#services-form'));
//        var toggle = element(by.css('#services-toggle'));
//        // on click
//        toggle.click();
//        expect(form.isDisplayed()).toBe(false);
//        // on second click
//        toggle.click();
//        expect(form.isDisplayed()).toBe(true);
//    });
//
//    // this is a slightly different version
//    it('check the toggle (again)', function () {
//        var form = element(by.css('#services-form'));
//        var toggle = element(by.css('#services-toggle'));
//        // on click
//        browser.actions().click(toggle).perform();
//        expect(form.isDisplayed()).toBe(false);
//        // on second click
//        browser.actions().click(toggle).perform();
//        expect(form.isDisplayed()).toBe(true);
//    });
});
