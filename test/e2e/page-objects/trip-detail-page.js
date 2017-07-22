var baseConfig = require('../config');

var config = {

    tripDetailPageUrl : baseConfig.pageBaseUrl + '/app/trip-detail',
    activeNavBar      : '.nav-bar-block[nav-bar="active"]',
    backBtn           : '.button-full.icon-shopeur-arrow-left',
    newProductBtn     : '.button-full.icon-shopeur-new-product',
    editTripBtn       : '.button-full.icon-shopeur-edit-product'

};

function TripDetailPage() {}

TripDetailPage.prototype.open = function() {
    browser.get(config.tripDetailPageUrl);
};

TripDetailPage.prototype.backBtn = function() {
    return element(by.css(config.activeNavBar)).element(by.css(config.backButton));
};

TripDetailPage.prototype.newProductBtn = function() {
    return element(by.css(config.newProductBtn));
};

TripDetailPage.prototype.editTripBtn = function() {
    return element(by.css(config.editTripBtn));
};

module.exports = TripDetailPage;
