var baseConfig = require('../config');

var TripPage = require('../page-objects/trip-page');
var TripsPage = require('../page-objects/trips-page');
var TripDetailPage = require('../page-objects/trip-detail-page');
var TestUtil = require('../test-util');

describe('Trip view', function () {

    var tripPage = new TripPage();
    var tripsPage = new TripsPage();
    var tripDetailPage = new TripDetailPage();
    var testUtil = new TestUtil();

    var EC = protractor.ExpectedConditions;

    beforeAll(function () {
        testUtil.syncAndLogin();
    });

    it('should cancel operation and go back to trips page', function () {

        tripsPage.open();

        expect(browser.getCurrentUrl()).toContain('#/app/trips');

        var newTripBtn = tripsPage.newTripBtn();
        newTripBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/trip');
        expect(browser.wait(EC.invisibilityOf(tripPage.getSyncMessage()), baseConfig.mediumWaitTimeout));

        var cancelBtn = tripPage.cancelBtn();
        cancelBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/trips');
    });

    it('should fill the trip form', function () {

        tripPage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/trip');

        //var country = tripPage.getCountrySelect();
        //country.click();

        //expect(browser.wait(EC.visibilityOf(tripPage.getSelectModal()), baseConfig.mediumWaitTimeout));

        //var selectedCountry = tripPage.selectCountry();
        //selectedCountry.click();

        //expect(browser.wait(EC.invisibilityOf(tripPage.getSyncMessage()), baseConfig.mediumWaitTimeout));

        //var city = tripPage.getCitySelect();
        //city.click();

        //expect(browser.wait(EC.visibilityOf(tripPage.getSelectModal()), baseConfig.mediumWaitTimeout));

        //var selectedCity = tripPage.selectCity();
        //selectedCity.click();

        //expect(browser.wait(EC.invisibilityOf(tripPage.getSyncMessage()), baseConfig.mediumWaitTimeout));

        var destination = tripPage.getDestinationSelect();
        destination.click();

        expect(browser.wait(EC.visibilityOf(tripPage.getSelectModal()), baseConfig.mediumWaitTimeout));

        var selectedDestination = tripPage.selectDestination();
        selectedDestination.click();

        expect(browser.wait(EC.invisibilityOf(tripPage.getSyncMessage()), baseConfig.mediumWaitTimeout));

        var startDate = tripPage.startDate();
        startDate.sendKeys("01.01.2018");

        var endDate = tripPage.endDate();
        endDate.sendKeys("17.01.2018");

        var createTripBtn = tripPage.createTripBtn();
        createTripBtn.click();

        expect(browser.wait(EC.invisibilityOf(tripPage.getSyncMessage()), baseConfig.longWaitTimeout));

        expect(browser.getCurrentUrl()).toContain('#/app/trips');
    });

    it('should go to trip page in edit mode', function () {

        tripsPage.open();

        var trip = tripsPage.trip();
        trip.click();

        var editTripBtn = tripDetailPage.editTripBtn();
        editTripBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/trip');
    });

    it('should go to product page', function () {

        tripsPage.open();

        var trip = tripsPage.trip();
        trip.click();

        var newProductBtn = tripDetailPage.newProductBtn();
        expect(browser.wait(EC.visibilityOf(newProductBtn), baseConfig.longWaitTimeout));

        newProductBtn.click();
        expect(browser.getCurrentUrl()).toContain('#/app/product');
    });
});
