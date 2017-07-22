var config = {
    pageUrl: 'http://web/#/app/shopping-trips',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    wishlistButtonSelector: '.button.wishlist',
    newTripSelector: '.button.create-trip',
    shoppingTripSelector: '.shopping-trip'
};

function ShoppingTripsPage() {}

ShoppingTripsPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

ShoppingTripsPage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

ShoppingTripsPage.prototype.getWishlistButton = function() {
    return element(by.css(config.wishlistButtonSelector));
};

ShoppingTripsPage.prototype.getNewTripButton = function() {
    return element(by.css(config.newTripSelector));
};

ShoppingTripsPage.prototype.getShoppingTrip = function() {
    return element(by.css(config.shoppingTripSelector));
};

module.exports = ShoppingTripsPage;