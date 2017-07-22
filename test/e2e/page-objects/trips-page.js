var baseConfig = require('../config');

var config = {

    tripsPageUrl : baseConfig.pageBaseUrl + '/app/trips',
    newTrip      : '#NewTripBtn',
    trip         : 'trip in group.trips'

};

function TripsPage() {}

TripsPage.prototype.open = function() {
    browser.get(config.tripsPageUrl);
};

TripsPage.prototype.newTripBtn = function() {
    return element(by.css(config.newTrip));
};

TripsPage.prototype.trip = function() {
    return element.all(by.repeater(config.trip)).get(0);
};

module.exports = TripsPage;
