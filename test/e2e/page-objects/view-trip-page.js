var config = {
    pageUrl: 'http://web/#/app/view-trip',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    tripImageSelector: '.trip-image',
    tripCloseButtonSelector: '.trip-detail .button.close',
    editButtonSelector: '.button.edit',
    addProductSelector: '.button.add-product'
};

function ViewTripPage() {}

ViewTripPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

ViewTripPage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

ViewTripPage.prototype.getTripImage = function() {
    return element(by.css(config.tripImageSelector));
};

ViewTripPage.prototype.getTripCloseButton = function() {
    return element(by.css(config.tripCloseButtonSelector));
};

ViewTripPage.prototype.getEditButton = function() {
    return element(by.css(config.editButtonSelector));
};

ViewTripPage.prototype.getAddProduct = function() {
    return element(by.css(config.addProductSelector));
};

module.exports = ViewTripPage;