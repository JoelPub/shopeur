var FooterMenu = require('../page-objects/footer-menu-page');
var TestUtil = require('../test-util');

describe('Footer menu', function () {

    var footerMenu = new FooterMenu();
    var testUtil = new TestUtil();

    beforeAll(function () {
        testUtil.syncAndLogin();
    });

    it('should  go to wishlist page', function () {

        var wishlistLink = footerMenu.wishlistLink();
        wishlistLink.click();

        expect(browser.getCurrentUrl()).toContain('#/app/wishlist');
    });

    it('should go to trips page', function () {

        var tripsLink = footerMenu.tripsLink();
        tripsLink.click();

        expect(browser.getCurrentUrl()).toContain('#/app/trips');
    });

    it('should go to home page', function () {

        var homeLink = footerMenu.homeLink();
        homeLink.click();

        expect(browser.getCurrentUrl()).toContain('#/app/home');
    });
});
