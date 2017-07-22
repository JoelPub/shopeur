var WelcomePage = require('../page-objects/welcome-page');

describe('Welcome view', function () {

    var welcomePage = new WelcomePage();
    var EC = protractor.ExpectedConditions;

    beforeAll(function () {

        welcomePage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/welcome');
        expect(browser.wait(EC.invisibilityOf(welcomePage.getSyncPopUp()), 20000, 'Wait sync is finished'));
    });

    it('should have 4 items and contains text', function () {

        var teaserList = welcomePage.getTeaserList();

        expect(teaserList.count()).toBe(4);
    });

    it('should go to login page', function () {

        var loginBtn = welcomePage.getLoginBtn();
        expect(loginBtn.isPresent);
        loginBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/login');
    });

    it('should go to sign-up page', function () {

        welcomePage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/welcome');

        var signUpBtn = welcomePage.getSignUpBtn();
        expect(signUpBtn.isPresent);
        signUpBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/sign-up');
    });

});
