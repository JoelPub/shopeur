var config = {
    pageUrl: 'http://web/#/app/add-product-trip',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    cancelButtonSelector: '.button.cancel',
    createButtonSelector: '.button.create'
    // ToDo: Check for image?
};

function AddProductTripPage() {}

AddProductTripPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

AddProductTripPage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

AddProductTripPage.prototype.getCancelButton = function() {
    return element(by.css(config.cancelButtonSelector));
};

AddProductTripPage.prototype.getCreateButton = function() {
    return element(by.css(config.createButtonSelector));
};

module.exports = AddProductTripPage;