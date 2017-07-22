var baseConfig = require('../config');

var config = {

    homePageUrl: baseConfig.pageBaseUrl + '/app/home',
    productBtn: 'button[ui-sref="app.product"]'

};


function HomePage() {}

HomePage.prototype.open = function() {
    browser.get(config.homePageUrl);
};

HomePage.prototype.getProductBtn = function() {
    return element(by.css(config.productBtn));
};

module.exports = HomePage;