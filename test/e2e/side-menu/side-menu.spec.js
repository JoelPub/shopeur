var SideMenu = require('../page-objects/side-menu-page');
var TestUtil = require('../test-util');

describe('Side menu', function () {

    var sideMenu = new SideMenu();
    var testUtil = new TestUtil();
    var EC = protractor.ExpectedConditions;

    beforeAll(function () {
        testUtil.syncAndLogin();
    });

    it('should go to profil page', function () {

        var sideMenuToggle = sideMenu.sideMenuToggle();
        sideMenuToggle.click();
        var profilLink = sideMenu.sideMenuItems().get(1);
        browser.wait(EC.visibilityOf(profilLink), 5000, 'Wait sync is finished');

        profilLink.click();

        expect(browser.getCurrentUrl()).toContain('#/app/profil');
    });

    it('should go to qrcode page', function () {

        var sideMenuToggle = sideMenu.sideMenuToggle();
        sideMenuToggle.click();
        var qrcodeLink = sideMenu.sideMenuItems().get(2);
        browser.wait(EC.visibilityOf(qrcodeLink), 5000, 'Wait sync is finished');
        qrcodeLink.click();

        expect(browser.getCurrentUrl()).toContain('#/app/qrcode');
    });

    it('should go to tax-refund page', function () {

        var sideMenuToggle = sideMenu.sideMenuToggle();
        sideMenuToggle.click();
        var taxRefundLink = sideMenu.sideMenuItems().get(3);
        browser.wait(EC.visibilityOf(taxRefundLink), 5000, 'Wait sync is finished');
        taxRefundLink.click();

        expect(browser.getCurrentUrl()).toContain('#/app/tax-refund');
    });

    it('should go to about page', function () {

        var sideMenuToggle = sideMenu.sideMenuToggle();
        sideMenuToggle.click();
        var aboutLink = sideMenu.sideMenuItems().get(4);
        browser.wait(EC.visibilityOf(aboutLink), 5000, 'Wait sync is finished');
        aboutLink.click();

        expect(browser.getCurrentUrl()).toContain('#/app/about');
    });

    it('should go to contact page', function () {

        var sideMenuToggle = sideMenu.sideMenuToggle();
        sideMenuToggle.click();
        var contactLink = sideMenu.sideMenuItems().get(5);
        browser.wait(EC.visibilityOf(contactLink), 5000, 'Wait sync is finished');
        contactLink.click();

        expect(browser.getCurrentUrl()).toContain('#/app/contact');
    });

    it('should go to settings page', function () {

        var sideMenuToggle = sideMenu.sideMenuToggle();
        sideMenuToggle.click();
        var settingsLink = sideMenu.sideMenuItems().get(6);
        browser.wait(EC.visibilityOf(settingsLink), 5000, 'Wait sync is finished');
        settingsLink.click();

        expect(browser.getCurrentUrl()).toContain('#/app/settings');
    });

});
