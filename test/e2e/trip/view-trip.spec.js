var ViewTripPage = require('../page-objects/view-trip-page');

describe('trip view', function() {

    var page;
    var EC = protractor.ExpectedConditions;

    beforeEach(function() {
        page = new ViewTripPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
     expect(page.getHeading().getText()).toBe('Trip');
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

    it('should go to edit trip page', function() {

        var addBtn = page.getAddProduct();
        expect(addBtn.isPresent);

        addBtn.isDisplayed().then(function(visible) {
            if (visible) {
                addBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/add-product-trip');
            }
        })
    });

});