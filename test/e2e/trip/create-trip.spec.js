var CreateTripPage = require('../page-objects/create-trip-page');

describe('create trip view', function() {

    var page;

    beforeEach(function() {
        page = new CreateTripPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
        expect(page.getHeading().getText()).toBe('Create Trip');
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

    it('should go to shopping trips overview page', function() {

        var createBtn = page.getCreateButton();
        expect(createBtn.isPresent);

        createBtn.isDisplayed().then(function(visible) {
            if (visible) {
                createBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/shopping-trips');
            }
        })
    });

    it('should show categories each after each', function() {

        var countrySelect = page.getCountrySelector();
        var citySelect = page.getCitySelector();
        var destinationSelect = page.getDestinationSelector();
        var startDate = page.getStartDate();
        var endDate = page.getEndDate();

        expect(countrySelect.isPresent);

        countrySelect.isDisplayed().then(function(visible) {
            if (visible) {
                // Show city selector
                expect(citySelect.isPresent);

                citySelect.isDisplayed().then(function(visible) {
                    if (visible) {
                        // Show destination selector
                        expect(destinationSelect.isPresent);

                        countrySelect.isDisplayed().then(function(visible) {
                            if (visible) {
                                expect(startDate.isPresent);

                                startDate.isDisplayed().then(function(visible) {
                                    if (visible) {
                                        expect(endDate.isPresent);

                                        endDate.isDisplayed();
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    });

});