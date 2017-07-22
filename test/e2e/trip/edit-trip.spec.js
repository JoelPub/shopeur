var EditTripPage = require('../page-objects/edit-trip-page');

describe('edit trip view', function() {

    var page;

    beforeEach(function() {
        page = new EditTripPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
     expect(page.getHeading().getText()).toBe('Edit Trip');
     });*/

    it('should go to view trip page', function() {

        var cancelBtn = page.getCancelButton();
        expect(cancelBtn.isPresent);

        cancelBtn.isDisplayed().then(function(visible) {
            if (visible) {
                cancelBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/view-trip');
            }
        })
    });

    it('should go to view trip page', function() {

        var saveBtn = page.getCancelButton();
        expect(saveBtn.isPresent);

        saveBtn.isDisplayed().then(function(visible) {
            if (visible) {
                saveBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/view-trip');
            }
        })
    });

});