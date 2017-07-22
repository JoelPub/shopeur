var config = {
    pageUrl: 'http://web/#/app/order-view',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    cancelOrderSelector: '.button.cancel-order',
    cancelCancelOrderSelector: '.button.cancel-cancel-order',
    reverseOrderSelector: '.button.reverse-order',
    showQrSelector: '.button.show-qr',
    QrBackSelector: '.button.back',
    messageSelector: '.button.message',
    messageCancelSelector: '.button.cancel-message',
    messageConfirmSelector: '.button.confirm-message'
};

function OrderViewPage() {}

OrderViewPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

OrderViewPage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

OrderViewPage.prototype.getCancelOrder = function() {
    return element(by.css(config.cancelOrderSelector));
};

OrderViewPage.prototype.getCancelCancelOrder = function() {
    return element(by.css(config.cancelCancelOrderSelector));
};

OrderViewPage.prototype.getReverseOrder = function() {
    return element(by.css(config.reverseOrderSelector));
};

OrderViewPage.prototype.getShowQr = function() {
    return element(by.css(config.showQrSelector));
};

OrderViewPage.prototype.getQrBack = function() {
    return element(by.css(config.QrBackSelector));
};

OrderViewPage.prototype.getMessage = function() {
    return element(by.css(config.messageSelector));
};

OrderViewPage.prototype.getMessageCancel = function() {
    return element(by.css(config.messageCancelSelector));
};

OrderViewPage.prototype.getMessageConfirm = function() {
    return element(by.css(config.messageConfirmSelector));
};

module.exports = OrderViewPage;