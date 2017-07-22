var baseConfig = require('../config');

var ProductPage = require('../page-objects/product-page');
var WishlistPage = require('../page-objects/wishlist-page');
var HomePage = require('../page-objects/home-page');
var TestUtil = require('../test-util');

describe('Product view', function () {

    var productPage = new ProductPage();
    var wishlistPage = new WishlistPage();
    var homePage = new HomePage();
    var testUtil = new TestUtil();

    var EC = protractor.ExpectedConditions;

    beforeAll(function () {
        testUtil.syncAndLogin();
    });

    it('should go to product page cancel and go back to home', function () {

        var productBtn = homePage.getProductBtn();
        productBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/product');

        var cancelBtn = productPage.getCancelBtn();
        cancelBtn.click();

        browser.sleep(500);
        expect(browser.getCurrentUrl()).toContain('#/app/home');
    });

    it('should click on create product without brand selection and see alert', function () {

        productPage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/product');

        var createProductBtn = productPage.getCreateBtn();
        createProductBtn.click();

        expect(browser.wait(EC.visibilityOf(productPage.getProductAlert()), baseConfig.longWaitTimeout));

        var productAlertButton = productPage.getProductAlertButton();
        productAlertButton.click();
    });

    it('should click on create product and go to wishlist page', function () {

        productPage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/product');

        var brand = productPage.getBrandSelect();
        brand.click();

        expect(browser.wait(EC.visibilityOf(productPage.getSelectModal()), baseConfig.longWaitTimeout));

        var selectedBrand = productPage.selectBrand('1');
        selectedBrand.click();

        expect(browser.wait(EC.invisibilityOf(productPage.getSelectModal()), baseConfig.longWaitTimeout));
        expect(browser.wait(EC.visibilityOf(element(by.css('.card'))), baseConfig.longWaitTimeout));

        var size = productPage.getSize();
        browser.executeScript(function () {
            arguments[0].scrollIntoView();
        }, size.getWebElement());

        expect(browser.wait(EC.visibilityOf(size), baseConfig.longWaitTimeout));

        var category = productPage.getCategorySelect();
        expect(category.isPresent()).toBe(true);
        category.click();

        expect(browser.wait(EC.visibilityOf(productPage.getSelectModal()), baseConfig.longWaitTimeout));

        var selectedCategory = productPage.selectCategory();
        selectedCategory.click();

        expect(browser.wait(EC.invisibilityOf(productPage.getSelectModal()), baseConfig.longWaitTimeout));

        var productCode = productPage.getProductCode();
        productCode.sendKeys('XS46464466');

        var createProductBtn = productPage.getCreateBtn();
        createProductBtn.click();

        browser.sleep(500);
        expect(browser.wait(browser.getCurrentUrl())).toContain('#/app/wishlist');
    });

    it('should update product, save and go back to wishlist', function () {

        var product = wishlistPage.getWishlistItem();
        expect(browser.wait(EC.visibilityOf(product), baseConfig.longWaitTimeout));
        product.click();

        expect(browser.getCurrentUrl()).toContain('#/app/product');

        var category = productPage.getCategorySelect();
        browser.executeScript(function () {
            arguments[0].scrollIntoView();
        }, category.getWebElement());

        expect(browser.wait(EC.visibilityOf(category), baseConfig.longWaitTimeout));

        var size = productPage.getSize();
        browser.executeScript(function () {
            arguments[0].scrollIntoView();
        }, size.getWebElement());

        expect(browser.wait(EC.visibilityOf(size), baseConfig.longWaitTimeout));

        size.sendKeys('50');

        var updateProductBtn = productPage.getUpdateBtn();
        updateProductBtn.click();

        browser.sleep(500);
        expect(browser.wait(browser.getCurrentUrl())).toContain('#/app/wishlist');
    });

});
