var baseConfig = require('../config');

var config = {
    tripPageUrl: baseConfig.pageBaseUrl + '/app/trip',
    activeNavBar: '.nav-bar-block[nav-bar="active"]',
    cancelButton: '#cancelButton',
    createTripBtn: '#createTripButton',
    loading: '.loading',
    modalSelect: '.modal-select',
    countrySelect: '.modal-select-box[data="vm.countries"]',
    countrySelection: '#countriesSelectModal .list .item:nth-child(1)',
    citySelect: '.modal-select-box[data="vm.cities"]',
    citySelection: '#citiesSelectModal .list .item:nth-child(1)',
    destinationSelect: '.modal-select-box[data="vm.destinations"]',
    destinationSelection: '#destinationsSelectModal > ion-content > div > ul > div > div:nth-child(2) > li:nth-child(2)',
    startDate: 'vm.form.startDate',
    endDate: 'vm.form.endDate'
};

function TripPage() {}

TripPage.prototype.open = function() {
    browser.get(config.tripPageUrl);
};

TripPage.prototype.cancelBtn = function() {
    return element(by.css(config.activeNavBar)).element(by.css(config.cancelButton));
};

TripPage.prototype.createTripBtn = function() {
    return element(by.css(config.activeNavBar)).element(by.css(config.createTripBtn));
};

TripPage.prototype.getSelectModal = function () {
    return element(by.css(config.modalSelect));
};

// Country
TripPage.prototype.getCountrySelect = function () {
    return element(by.css(config.countrySelect));
};

TripPage.prototype.selectCountry = function () {
    return element(by.css(config.countrySelection));
};

// City
TripPage.prototype.getCitySelect = function () {
    return element(by.css(config.citySelect));
};

TripPage.prototype.selectCity = function () {
    return element(by.css(config.citySelection));
};

// Destination
TripPage.prototype.getDestinationSelect = function () {
    return element(by.css(config.destinationSelect));
};

TripPage.prototype.selectDestination = function () {
    return element(by.css(config.destinationSelection));
};

TripPage.prototype.startDate = function() {
    return element(by.model(config.startDate));
};

TripPage.prototype.endDate = function() {
    return element(by.model(config.endDate));
};

TripPage.prototype.getSyncMessage = function() {
    return element(by.css(config.loading));
};

module.exports = TripPage;
