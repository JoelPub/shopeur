var WelcomePage = require('../page-objects/welcome-page');
var LoginPage = require('../page-objects/login-page');

describe('Login', function () {

    var welcomePage = new WelcomePage();
    var loginPage = new LoginPage();

    var EC = protractor.ExpectedConditions;

    beforeAll(function () {
        welcomePage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/welcome');
        expect(browser.wait(EC.invisibilityOf(welcomePage.getSyncPopUp()), 20000, 'Wait sync is finished'));
    });

    it('should login and go to home', function () {
        var loginBtn = welcomePage.getLoginBtn();
        loginBtn.isDisplayed()
            .then(function (visible) {
                if (visible) {
                    loginBtn.click();
                    expect(browser.getCurrentUrl()).toContain('#/app/login');
                }
            });

        loginPage.setUsername('chihun@h17n.de');
        loginPage.setPassword('xxxxxx');

        // login & redirect to home

        var submitBtn = loginPage.getLoginBtn();
        submitBtn.isDisplayed().then(function (visible) {
            if (visible) {
                // TODO: fix login/redirect (alert is shown)
                // return;
                submitBtn.click();

                browser.sleep(10000);
                expect(browser.getCurrentUrl()).toContain('#/app/home');
            }
        });

    });


    it('should go to signup', function () {
        loginPage.open();
        var signupBtn = loginPage.getSignUpBtn();
        signupBtn.isDisplayed()
            .then(function (visible) {
                if (visible) {
                    signupBtn.click();
                    expect(browser.getCurrentUrl()).toContain('#/app/sign-up');
                }
            });
    });
});
