var baseConfig = require('../config');

var config = {
    welcomePageUrl: baseConfig.pageBaseUrl + '/app/welcome',
    loginPageUrl: baseConfig.pageBaseUrl + '/app/login',
    loginInput: 'vm.credentials.login',
    pwInput: 'vm.credentials.password',
    loginBtn: '.button-large.button.login',
    pwForgottenBtn: '.button.forgot',
    signUpBtn: '.button.sign-up'
};

function LoginPage() {}

LoginPage.prototype.open = function() {
    browser.get(config.loginPageUrl);
};

LoginPage.prototype.setUsername = function(username) {
    element(by.model(config.loginInput)).sendKeys(username);
};

LoginPage.prototype.setPassword = function(password) {
    element(by.model(config.pwInput)).sendKeys(password);
};

LoginPage.prototype.getLoginBtn = function() {
    return element(by.css(config.loginBtn));
};

LoginPage.prototype.getPasswordForgotBtn = function() {
    return element(by.css(config.pwForgottenBtn));
};

LoginPage.prototype.getSignUpBtn = function() {
    return element(by.css(config.signUpBtn));
};

module.exports = LoginPage;