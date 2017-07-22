var config = {
    pageUrl: 'http://web/#/app/add-product-inspire',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    cancelButtonSelector: '.button.cancel',
    createButtonSelector: '.button.create',
    productImageSelector: '.image img'
};

function AddProductInspirePage() {}

AddProductInspirePage.prototype.open = function() {
    browser.get(config.pageUrl);
};

AddProductInspirePage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

AddProductInspirePage.prototype.getCancelButton = function() {
    return element(by.css(config.cancelButtonSelector));
};

AddProductInspirePage.prototype.getCreateButton = function() {
    return element(by.css(config.createButtonSelector));
};

AddProductInspirePage.prototype.getProductImage = function() {
    return element(by.css(config.productImageSelector));
};

module.exports = AddProductInspirePage;