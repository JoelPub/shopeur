var SettingsPage = require('../page-objects/settings-page');
var TestUtil = require('../test-util');

describe('Settings view', function () {

    var settingsPage = new SettingsPage();
    var testUtil = new TestUtil();

    beforeAll(function () {
        testUtil.syncAndLogin();
    });

    it('should go to settings page and check app version', function () {

        settingsPage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/settings');

        var versionElement = settingsPage.getVersionElement();
        expect(versionElement.isPresent()).toBe(true);

        expect(versionElement.getText()).toEqual(settingsPage.getAppVersion());
    });

});
