var config = {
    pageUrl: 'http://web/#/app/product-list',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    tripImageSelector: '.trip-image',
    tripCloseButtonSelector: '.trip-detail .button.close',
    editButtonSelector: '.button.edit',
    addProductButtonSelector: '.button.add-product',
    preorderButtonSelector: '.button.preorder',
    brandInfoSelector: '.button.brand-info',
    brandInfoCloseSelector: '.brand-info .button.close',
    cancelPaymentButtonSelector: '.button.cancel-payment',
    paymentButtonSelector: '.button.pay'
};

function ProductListPage() {}

ProductListPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

ProductListPage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

ProductListPage.prototype.getTripImage = function() {
    return element(by.css(config.tripImageSelector));
};

ProductListPage.prototype.getTripCloseButton = function() {
    return element(by.css(config.tripCloseButtonSelector));
};

ProductListPage.prototype.getEditButton = function() {
    return element(by.css(config.editButtonSelector));
};

ProductListPage.prototype.getAddProductButton = function() {
    return element(by.css(config.addProductButtonSelector));
};

ProductListPage.prototype.getPreorderButton = function() {
    return element(by.css(config.preorderButtonSelector));
};

ProductListPage.prototype.getbrandInfoButton = function() {
    return element(by.css(config.brandInfoSelector));
};

ProductListPage.prototype.getbrandInfoCloseButton = function() {
    return element(by.css(config.brandInfoCloseSelector));
};

ProductListPage.prototype.getCancelPaymentButton = function() {
    return element(by.css(config.cancelPaymentButtonSelector));
};

ProductListPage.prototype.getPaymentButton = function() {
    return element(by.css(config.paymentButtonSelector));
};

module.exports = ProductListPage;