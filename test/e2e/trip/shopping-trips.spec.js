var ShoppingTripsPage = require('../page-objects/shopping-trips-page');

describe('shopping trips view', function() {

    var page;

    beforeEach(function() {
        page = new ShoppingTripsPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
     expect(page.getHeading().getText()).toBe('Trips');
     });*/

    it('should go to wishlist page', function() {

        var wishlistBtn = page.getWishlistButton();
        expect(wishlistBtn.isPresent);

        wishlistBtn.isDisplayed().then(function(visible) {
            if (visible) {
                wishlistBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/wishlist');
            }
        })
    });

    it('should go to create trip page', function() {

        var newTripBtn = page.getNewTripButton();
        expect(newTripBtn.isPresent);

        newTripBtn.isDisplayed().then(function(visible) {
            if (visible) {
                newTripBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/create-trip');
            }
        })
    });

    it('should go to trip view page', function() {

        var viewTripBtn = page.getShoppingTrip();
        expect(viewTripBtn.isPresent);

        viewTripBtn.isDisplayed().then(function(visible) {
            if (visible) {
                viewTripBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/view-trip');
            }
        })
    });

});