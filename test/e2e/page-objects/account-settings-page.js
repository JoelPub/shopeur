var config = {
    pageUrl: 'http://web/#/app/account-settings',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    emailFieldSelector: '.input.email',
    passwordFieldSelector: '.input.password',
    setPasswordSelector: '.button.set-password'
};

function AccountSettingsPage() {}

AccountSettingsPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

AccountSettingsPage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

AccountSettingsPage.prototype.getEmailInput = function() {
    return element(by.css(config.emailFieldSelector));
};

AccountSettingsPage.prototype.getPasswordInput = function() {
    return element(by.css(config.passwordFieldSelector));
};

AccountSettingsPage.prototype.getSetPasswordButton = function() {
    return element(by.css(config.setPasswordSelector));
};

module.exports = AccountSettingsPage;