var baseConfig = require('../config');
var config = {
    pageUrl: baseConfig.pageBaseUrl + '/app/trip',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    cancelButtonSelector: '.button.cancel',
    createButtonSelector: '.button.create',
    countrySelector: '.select.country',
    citySelector: '.select.city',
    destinationSelector: '.select.destination',
    startDateSelector: '.select.start-date',
    endDateSelector: '.select.end-date'
};

function CreateTripPage() {}

CreateTripPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

CreateTripPage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

CreateTripPage.prototype.getCancelButton = function() {
    return element(by.css(config.cancelButtonSelector));
};

CreateTripPage.prototype.getCreateButton = function() {
    return element(by.css(config.createButtonSelector));
};

CreateTripPage.prototype.getCountrySelector = function() {
    return element(by.css(config.countrySelector));
};

CreateTripPage.prototype.getCitySelector = function() {
    return element(by.css(config.citySelector));
};

CreateTripPage.prototype.getDestinationSelector = function() {
    return element(by.css(config.destinationSelector));
};

CreateTripPage.prototype.getStartDate = function() {
    return element(by.css(config.startDateSelector));
};

CreateTripPage.prototype.getEndDate = function() {
    return element(by.css(config.endDateSelector));
};

module.exports = CreateTripPage;