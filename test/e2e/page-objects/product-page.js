var baseConfig = require('../config');

var config = {

    productPageUrl: baseConfig.pageBaseUrl + '/app/product',
    modalSelect: '.modal-select',
    brandSelect: 'ion-view[nav-view="active"] #brandsSelect',
    //brandSelection: '#brandsSelectModal .list .item:nth-child(2)',
    categorySelect: 'ion-view[nav-view="active"] #categoriesSelect',
    categorySelection: '#categoriesSelectModal .list .item:nth-child(2)',
    sizeInput: 'ion-view[nav-view="active"] input#size',
    productCode: 'ion-view[nav-view="active"] input#productCode',
    createBtn: '#createProductButton',
    cancelBtn: '#cancelButton',
    updateBtn: '#updateProductButton',
    activeNavBar: '.nav-bar-block[nav-bar="active"]',
    productAlert: '.popup',
    productAlertButton: '.popup .button'
};

function ProductPage() {
}

ProductPage.prototype.open = function () {
    browser.get(config.productPageUrl);
};

// Brand selection
ProductPage.prototype.getBrandSelect = function () {
    return element(by.css(config.brandSelect));
};

ProductPage.prototype.selectBrand = function (index) {
    return element(by.css('#brandsSelectModal .list .item:nth-child(' + index + ')'));
};

// Category selection
ProductPage.prototype.getCategorySelect = function () {
    return element(by.css(config.categorySelect));
};

ProductPage.prototype.selectCategory = function () {
    return element(by.css(config.categorySelection));
};

// Inputs
ProductPage.prototype.getSize = function () {
    return element(by.css(config.sizeInput));
};

ProductPage.prototype.getProductCode = function () {
    return element(by.css(config.productCode));
};

// Buttons
ProductPage.prototype.getCancelBtn = function () {
    return element(by.css(config.activeNavBar)).element(by.css(config.cancelBtn));
};

ProductPage.prototype.getCreateBtn = function () {
    return element(by.css(config.activeNavBar)).element(by.css(config.createBtn));
};

ProductPage.prototype.getUpdateBtn = function () {
    return element(by.css(config.activeNavBar)).element(by.css(config.updateBtn));
};

// Modals & PopUps
ProductPage.prototype.getSelectModal = function () {
    return element(by.css(config.modalSelect));
};

ProductPage.prototype.syncMessage = function () {
    return element(by.css(config.loading));
};

ProductPage.prototype.getProductAlert = function () {
    return element(by.css(config.productAlert));
};

ProductPage.prototype.getProductAlertButton = function () {
    return element(by.css(config.productAlertButton));
};

module.exports = ProductPage;