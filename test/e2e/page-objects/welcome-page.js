var baseConfig = require('../config');

var config = {
    welcomePageUrl: baseConfig.pageBaseUrl + '/app/welcome',
    loading: '.loading',
    teaserListRepeater: 'teaser in vm.teasers',
    loginBtn: '.button.login',
    signupBtn: '.button.sign-up'
};

function WelcomePage() {}

WelcomePage.prototype.open = function() {
    browser.get(config.welcomePageUrl);
};

WelcomePage.prototype.getSyncPopUp = function() {
    return element(by.css(config.loading));
};

WelcomePage.prototype.getTeaserList = function() {
    return element.all(by.repeater(config.teaserListRepeater));
};

WelcomePage.prototype.getLoginBtn = function() {
    return element(by.css(config.loginBtn));
};

WelcomePage.prototype.getSignUpBtn = function() {
    return element(by.css(config.signupBtn));
};

module.exports = WelcomePage;