var WishlistPage = require('../page-objects/wishlist-page');
var HomePage = require('../page-objects/home-page');
var TestUtil = require('../test-util');

describe('Wishlist view', function () {

    var wishlistPage = new WishlistPage();
    var homePage = new HomePage();
    var testUtil = new TestUtil();

    beforeAll(function () {
        testUtil.syncAndLogin();
        homePage.open();
    });

    it('should go to product page', function () {

        wishlistPage.open();

        var newProductBtn = wishlistPage.newProductBtn();
        expect(newProductBtn.isPresent()).toBe(true);
        newProductBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/product');
    });

});
