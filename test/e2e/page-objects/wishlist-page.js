var baseConfig = require('../config');

var config = {

    wishlistPageUrl: baseConfig.pageBaseUrl + '/app/wishlist',
    newProduct: '#wishlistNewProductBtn',
    editProductBtn: '#wishlistEditProductBtn',
    producList: 'product in vm.products'
};

function WishlistPage() {}

WishlistPage.prototype.open = function() {
    browser.get(config.wishlistPageUrl);
};

WishlistPage.prototype.newProductBtn = function() {
    return element(by.css(config.newProduct));
};

WishlistPage.prototype.editProductBtn = function() {
    return element(by.css(config.editProductBtn));
};

WishlistPage.prototype.getWishlistItem = function() {
    return element.all(by.repeater(config.producList)).get(0);
};

module.exports = WishlistPage;

