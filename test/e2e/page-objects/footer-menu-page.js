var baseConfig = require('../config');

var config = {

    homeLink: '#footerHome',
    wishlistLink: '#footerWishlist',
    productLink: '#footerProduct',
    tripsLink: '#footerTrips'
    //notificationsLink: '#footerNotifications'

};

function FooterMenu() {}

FooterMenu.prototype.homeLink = function() {
    return element(by.css(config.homeLink));
};

FooterMenu.prototype.wishlistLink = function() {
    return element(by.css(config.wishlistLink));
};

FooterMenu.prototype.productLink = function() {
    return element(by.css(config.productLink));
};

FooterMenu.prototype.tripsLink = function() {
    return element(by.css(config.tripsLink));
};

/*FooterMenu.prototype.notificationsLink = function() {
    return element(by.css(config.homeLink));
};*/

module.exports = FooterMenu;