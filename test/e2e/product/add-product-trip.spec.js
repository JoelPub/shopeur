var LoginPage = require('../page-objects/login-page');
var loginPage = new LoginPage();

var AddProductTripPage = require('../page-objects/add-product-trip-page');

describe('add product to trip view', function() {

    var page;

  beforeAll(function () {
    loginPage.login();
  });

  beforeEach(function() {
        page = new AddProductTripPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
     expect(page.getHeading().getText()).toBe('Add Product to Trip');
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

});
