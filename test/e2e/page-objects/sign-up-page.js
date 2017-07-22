var baseConfig = require('../config');

var config = {
    welcomePageUrl: baseConfig.pageBaseUrl + '/app/welcome',
    signUpPageUrl: baseConfig.pageBaseUrl + '/app/sign-up',
    usernameInput: 'vm.user.surname',
    emailInput: 'vm.user.email',
    pw1Input: 'vm.user.password1',
    pw2Input: 'vm.user.password2',
    signUpBtn: '.button.create',
    popup: '.popup',
    popupBtn: '.popup button',
    popupBody: '.popup .popup-body span'
};

function SignupPage() {}

SignupPage.prototype.open = function() {
    browser.get(config.signUpPageUrl);
};

SignupPage.prototype.setSurname = function(surname) {
    element(by.model(config.usernameInput)).sendKeys(surname);
};

SignupPage.prototype.setEmail = function(email) {
    element(by.model(config.emailInput)).sendKeys(email);
};

SignupPage.prototype.setPassword1 = function(pwd1) {
    element(by.model(config.pw1Input)).sendKeys(pwd1);
};

SignupPage.prototype.setPassword2 = function(pwd2) {
    element(by.model(config.pw2Input)).sendKeys(pwd2);
};

SignupPage.prototype.getSignUpBtn = function() {
    return element(by.css(config.signUpBtn));
};

SignupPage.prototype.getSignUpAlert = function() {
    return element(by.css(config.popup));
};

SignupPage.prototype.getSignUpAlertButton = function() {
    return element(by.css(config.popupBtn));
};

SignupPage.prototype.getSignUpAlertMessage = function() {
    return element(by.css(config.popupBody));
};


module.exports = SignupPage;