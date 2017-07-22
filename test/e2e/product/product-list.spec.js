var ProductListPage = require('../page-objects/product-list-page');

describe('product list view', function() {

    var page;
    var EC = protractor.ExpectedConditions;

    beforeEach(function() {
        page = new ProductListPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
     expect(page.getHeading().getText()).toBe('Products');
     });*/

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor

    it('should open a modal with trip details and close it on click on close button', function() {

        // Trip Detail Modal

        var tripImage = page.getTripImage();
        var tripClose = page.getTripCloseButton();
        expect(tripImage.isPresent);

        tripImage.isDisplayed().then(function(visible) {
            if (visible) {
                tripImage.click();
                expect(browser.wait(EC.visibilityOf($('.trip-detail')), baseConfig.shortWaitTimeout));

                expect(tripClose.isPresent);

                tripClose.isDisplayed().then(function(visible) {
                    if (visible) {
                        tripClose.click();
                        expect(browser.wait(EC.inVisibilityOf($('.trip-detail')), baseConfig.shortWaitTimeout));
                    }
                })
            }
        })

    });

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor END


    it('should go to edit trip page', function() {

        var editBtn = page.getEditButton();
        expect(editBtn.isPresent);

        editBtn.isDisplayed().then(function(visible) {
            if (visible) {
                editBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/edit-trip');
            }
        })
    });

    it('should go to add product page', function() {

        var addProductBtn = page.getAddProductButton();
        expect(addProductBtn.isPresent);

        addProductBtn.isDisplayed().then(function(visible) {
            if (visible) {
                addProductBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/add-product');
            }
        })
    });

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor

    it('should open preorder modal and close on click on close button or go to order view page on click on pay button', function() {

        // Preorder and Payment Modal

        var preorderButton = page.getPreorderButton();
        var cancelPayment = page.getCancelPaymentButton();
        var paymentBtn = page.getPaymentButton();
        expect(preorderButton.isPresent);

        preorderButton.isDisplayed().then(function(visible) {
            if (visible) {
                preorderButton.click();
                expect(browser.wait(EC.visibilityOf($('.preorder')), baseConfig.shortWaitTimeout));

                expect(cancelPayment.isPresent);

                cancelPayment.isDisplayed().then(function(visible) {
                    if (visible) {
                        cancelPayment.click();
                        expect(browser.wait(EC.inVisibilityOf($('.preorder')), baseConfig.shortWaitTimeout));
                    }
                })

                expect(paymentBtn.isPresent);

                paymentBtn.isDisplayed().then(function(visible) {
                    if (visible) {
                        paymentBtn.click();
                        expect(browser.getCurrentUrl()).toContain('#/app/order-view');
                    }
                })
            }
        })

    });

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor END


    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor

    it('should open a modal with brand/store information and close it on close button', function() {

        // Brand Info Modal

        var brandInfoBtn = page.getBrandInfoButton();
        var brandInfoCloseBtn = page.getBrandInfoCloseButton();
        expect(brandInfoBtn.isPresent);

        brandInfoBtn.isDisplayed().then(function(visible) {
            if (visible) {
                brandInfoBtn.click();
                expect(browser.wait(EC.visibilityOf($('.brand-info')), baseConfig.shortWaitTimeout));

                expect(brandInfoCloseBtn.isPresent);

                brandInfoCloseBtn.isDisplayed().then(function(visible) {
                    if (visible) {
                        brandInfoCloseBtn.click();
                        expect(browser.wait(EC.inVisibilityOf($('.brand-info')), baseConfig.shortWaitTimeout));
                    }
                })
            }
        })

    });

    // ToDo: check modal visibility: http://stackoverflow.com/questions/29323717/how-to-handle-modal-dialog-box-in-protractor END


});