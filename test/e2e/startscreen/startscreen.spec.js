var StartscreenPage = require('../page-objects/startscreen-page');

describe('startscreen view', function() {

    var page;
    var EC = protractor.ExpectedConditions;

    beforeEach(function() {
        page = new StartscreenPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
     expect(page.getHeading().getText()).toBe('Start');
     });*/

    it('should go to add product page', function() {

        var addProductButton = page.getAddProductButton();
        expect(addProductButton.isPresent);

        addProductButton.isDisplayed().then(function(visible) {
            if (visible) {
                addProductButton.click();
                expect(browser.getCurrentUrl()).toContain('#/app/add-product');
            }
        })
    });

    it('should go to profile page', function() {

        var welcomeMessage = page.getWelcomeMessage();
        expect(welcomeMessage.isPresent);

        welcomeMessage.isDisplayed().then(function(visible) {
            if (visible) {
                welcomeMessage.click();
                expect(browser.getCurrentUrl()).toContain('#/app/profile');
            }
        })
    });

    it('should go to create trip page', function() {

        var createTrip = page.getCreateTrip();
        expect(createTrip.isPresent);

        createTrip.isDisplayed().then(function(visible) {
            if (visible) {
                createTrip.click();
                expect(browser.getCurrentUrl()).toContain('#/app/create-trip');
            }
        })
    });

    it('should go to add product page', function() {

        var addProduct = page.getAddProduct();
        expect(addProduct.isPresent);

        addProduct.isDisplayed().then(function(visible) {
            if (visible) {
                addProduct.click();
                expect(browser.getCurrentUrl()).toContain('#/app/add-product');
            }
        })
    });

    it('should go to story page', function() {

        var story = page.getStory();
        expect(story.isPresent);

        story.isDisplayed().then(function(visible) {
            if (visible) {
                story.click();
                expect(browser.getCurrentUrl()).toContain('#/app/story');
            }
        })
    });

    /*
     For Swipe-Event see:
     http://stackoverflow.com/questions/15479143/webdriver-simulate-touch-events-in-desktop-browser
     */

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor
    // ToDo: should we check if more than one products are available?

    it('should open modal with get inspired product and close it on click on close button', function() {

        // Message modal opened

        var getInspired = page.getGetInspired();
        var getInspiredCloseButton = page.getGetInspiredCloseButton();
        expect(getInspired.isPresent);

        getInspired.isDisplayed().then(function(visible) {
            if (visible) {
                getInspired.click();
                expect(browser.wait(EC.visibilityOf($('.get-inspired-detail')), baseConfig.shortWaitTimeout));

                expect(getInspiredCloseButton .isPresent);

                getInspiredCloseButton .isDisplayed().then(function(visible) {
                    if (visible) {
                        getInspiredCloseButton .click();
                        expect(browser.wait(EC.inVisibilityOf($('.get-inspired-detail')), baseConfig.shortWaitTimeout));
                    }
                })
            }
        })

    });

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor END


    it('should go to add product from inspire page', function() {

        var addProductInspireButton = page.getAddProductInspire();
        expect(addProductInspireButton.isPresent);

        addProductInspireButton.isDisplayed().then(function(visible) {
            if (visible) {
                addProductInspireButton.click();
                expect(browser.getCurrentUrl()).toContain('#/app/add-product-inspire');
            }
        })
    });

    // ToDo: add WeChat Test

    // What should happen here?

    // ToDo: WeChat Test End

});