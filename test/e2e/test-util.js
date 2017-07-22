var baseConfig = require('./config');

var WelcomePage = require('./page-objects/welcome-page');
var LoginPage = require('./page-objects/login-page');

function TestUtil() {
}

/**
 * Wraps the sync and login operation that is required
 * to start certain tests.
 */
TestUtil.prototype.syncAndLogin = function () {

    var welcomePage = new WelcomePage();
    var loginPage = new LoginPage();

    var EC = protractor.ExpectedConditions;

    welcomePage.open();

    expect(browser.wait(EC.invisibilityOf(welcomePage.getSyncPopUp()), baseConfig.longWaitTimeout));

    loginPage.open();
    loginPage.setUsername('chihun@h17n.de');
    loginPage.setPassword('xxxxxx');

    var submitBtn = loginPage.getLoginBtn();
    submitBtn.isDisplayed().then(function (visible) {
        if (visible) {
            submitBtn.click();
            expect(browser.wait(EC.invisibilityOf(welcomePage.getSyncPopUp()), baseConfig.longWaitTimeout));
            expect(browser.getCurrentUrl()).toContain('#/app/home');
        }
    });
};

module.exports = TestUtil;
