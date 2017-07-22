var config = {
    pageUrl: 'http://web/#/app/login',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    addProductButtonSelector: '.button.add-product',
    welcomeMessageSelector: '.welcome-message',
    createTripSelector: '.create-trip',
    addProductSelector: '.add-product',
    storySelector: '.story',
    getInspiredSelector: '.get-inspired-overview',
    getInspiredCloseButtonSelector: '.get-inspired-detail .button.close',
    addProductInspireSelector: '.button.wishlist',
    weChatSelector: '.button.wechat'
};

function StartscreenPage() {}

StartscreenPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

StartscreenPage.prototype.getAddProductButton = function() {
    return element(by.css(config.addProductButtonSelector));
};

StartscreenPage.prototype.getWelcomeMessage = function() {
    return element(by.css(config.welcomeMessageSelector));
};

StartscreenPage.prototype.getCreateTrip = function() {
    return element(by.css(config.createTripSelector));
};

StartscreenPage.prototype.getAddProduct = function() {
    return element(by.css(config.addProductSelector));
};

StartscreenPage.prototype.getStory = function() {
    return element(by.css(config.storySelector));
};

StartscreenPage.prototype.getGetInspiredList = function() {
    return element.all(by.repeater(config.getInspiredRepeater));
};

StartscreenPage.prototype.getGetInspired = function() {
    return element.all(by.repeater(config.getInspiredSelector));
};

StartscreenPage.prototype.getGetInspiredCloseButton = function() {
    return element.all(by.repeater(config.getInspiredCloseButtonSelector));
};

StartscreenPage.prototype.getAddProductInspire = function() {
    return element.all(by.repeater(config.addProductInspireSelector));
};

StartscreenPage.prototype.getWechatButton = function() {
    return element.all(by.repeater(config.weChatSelector));
};


module.exports = StartscreenPage;