var baseConfig = require('../config');

var WelcomePage = require('../page-objects/welcome-page');
var SignUpPage = require('../page-objects/sign-up-page');

function createUserEmail() {
    return Math.random().toString(36).substring(2, 11) + '@h17n.de';
}

describe('Sign-Up', function () {

    var welcomePage = new WelcomePage();
    var signUpPage = new SignUpPage();

    var EC = protractor.ExpectedConditions;

    beforeEach(function () {
        welcomePage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/welcome');
        expect(browser.wait(EC.invisibilityOf(welcomePage.getSyncPopUp()), baseConfig.longWaitTimeout));
    });

    it('should try to sign-up with a too short password', function () {

        var signUpBtn = welcomePage.getSignUpBtn();
        signUpBtn.isDisplayed()
            .then(function (visible) {
                if (visible) {
                    signUpBtn.click();
                    expect(browser.getCurrentUrl()).toContain('#/app/sign-up');

                    signUpPage.setEmail(createUserEmail());
                    signUpPage.setPassword1('xxxx');
                    signUpPage.setPassword2('xxxx');

                    var submitBtn = signUpPage.getSignUpBtn();
                    submitBtn.isDisplayed()
                        .then(function (visible) {
                            if (visible) {
                                submitBtn.click();
                                expect(browser.wait(EC.visibilityOf(signUpPage.getSignUpAlert()), baseConfig.longWaitTimeout));

                                var message = signUpPage.getSignUpAlertMessage();
                                expect(message.getText()).toEqual('Password should contain at least 6 characters.');

                                var okBtn = signUpPage.getSignUpAlertButton();
                                okBtn.click();

                                expect(browser.getCurrentUrl()).toContain('#/app/sign-up');
                            }
                        });
                }
            });
    });

    it('should sign-up successfully and go to home', function () {

        var signUpBtn = welcomePage.getSignUpBtn();
        signUpBtn.isDisplayed()
            .then(function (visible) {
                if (visible) {
                    signUpBtn.click();
                    expect(browser.getCurrentUrl()).toContain('#/app/sign-up');

                    signUpPage.setEmail(createUserEmail());
                    signUpPage.setPassword1('secret');
                    signUpPage.setPassword2('secret');

                    var submitBtn = signUpPage.getSignUpBtn();
                    submitBtn.isDisplayed()
                        .then(function (visible) {
                            if (visible) {
                                submitBtn.click();
                                expect(browser.wait(EC.visibilityOf(signUpPage.getSignUpAlert()), baseConfig.longWaitTimeout));

                                var okBtn = signUpPage.getSignUpAlertButton();
                                okBtn.click();

                                expect(browser.getCurrentUrl()).toContain('#/app/login');
                            }
                        });
                }
            });
    });
});