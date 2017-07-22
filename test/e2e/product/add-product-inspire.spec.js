var AddProductInspirePage = require('../page-objects/add-product-inspire-page');

describe('add product view', function() {

    var page;

    beforeEach(function() {
        page = new AddProductInspirePage();
        page.open();
    });

    /*it('should show a proper heading', function() {
     expect(page.getHeading().getText()).toBe('Create Product');
     });*/


    it('should go to startscreen page', function() {

        var cancelBtn = page.getCancelButton();
        expect(cancelBtn.isPresent);

        cancelBtn.isDisplayed().then(function(visible) {
            if (visible) {
                cancelBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/home');
            }
        })
    });

    it('should go to product list page', function() {

        var createBtn = page.getCancelButton();
        expect(createBtn.isPresent);

        createBtn.isDisplayed().then(function(visible) {
            if (visible) {
                createBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/product-list');
            }
        })
    });

    it('should contain a product image from get inspired', function() {

        var productImage = page.getProductImage();
        expect(productImage.isPresent);

    });

});