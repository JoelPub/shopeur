var TripsPage = require('../page-objects/trips-page');
var TestUtil = require('../test-util');

describe('Trips view', function () {

    var tripsPage = new TripsPage();
    var testUtil = new TestUtil();

    beforeAll(function () {
        testUtil.syncAndLogin();
    });

    it('should go to trip page', function () {
        tripsPage.open();
        var newTripBtn = tripsPage.newTripBtn();
        newTripBtn.click();
        expect(browser.getCurrentUrl()).toContain('#/app/trip');
    });
});
