var ProfilePage = require('../page-objects/profile-page');
var TestUtil = require('../test-util');

describe('Profile view', function () {

    var profilePage = new ProfilePage();
    var testUtil = new TestUtil();

    beforeAll(function () {
        testUtil.syncAndLogin();
    });

    it('should go to edit profile page', function () {

        profilePage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/profile');

        var editProfileBtn = profilePage.getEditProfileBtn();
        expect(editProfileBtn.isPresent()).toBe(true);
        editProfileBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/edit-profile');
    });

    it('should go to account settings page', function () {

        profilePage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/profile');

        var accountSettingsBtn = profilePage.getAccountSettingsBtn();
        expect(accountSettingsBtn.isPresent()).toBe(true);
        accountSettingsBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/account-settings');
    });

});
