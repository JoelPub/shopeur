var AccountSettingsPage = require('../page-objects/account-settings-page');

describe('profile view', function() {

    var page;

    beforeEach(function() {
        page = new AccountSettingsPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
     expect(page.getHeading().getText()).toBe('Account Settings');
     });*/

    it('contains text', function() {
        var email = page.getEmailInput();
        expect(page.email.getText());
    });

    it('contains text', function() {
        var password = page.getPasswordInput();
        expect(page.password.getText());
    });

    it('should go to startscreen page', function() {

        var setPasswordBtn = page.getSetPasswordButton();
        expect(setPasswordBtn.isPresent);

        setPasswordBtn.isDisplayed().then(function(visible) {
            if (visible) {
                setPasswordBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/profile');
            }
        })
    });

});
