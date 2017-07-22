var baseConfig = require('../config');

var config = {
    profilePageUrl     : baseConfig.pageBaseUrl + '/app/profile',
    editBtn            : 'div[ui-sref="app.edit-profile"]',
    accountSettingsBtn : 'div[ui-sref="app.account-settings"]',
    completeName       : 'profile.name',
    dateOfBirth        : '#profileDateOfBirth',
    gender             : '#profileGender',
    bodyHeight         : '#profileBodyHeight',
    chest              : '#profileChest',
    weight             : '#profileWeight',
    waist              : '#profileWaist',
    hips               : '#profileHips',
    shoeSize           : '#profileShoeSize',
    colors             : 'color in vm.profile.colors'
};

function ProfilePage() {}

ProfilePage.prototype.open = function() {
    browser.get(config.profilePageUrl);
};

ProfilePage.prototype.getEditProfileBtn = function() {
    return element(by.css(config.editBtn));
};

ProfilePage.prototype.getAccountSettingsBtn = function() {
    return element(by.css(config.accountSettingsBtn));
};

ProfilePage.prototype.getCompleteName = function() {
    return element(by.binding(config.completeName));
};

ProfilePage.prototype.getDateOfBirth = function() {
    return element(by.css(config.dateOfBirth));
};

ProfilePage.prototype.getGender = function() {
    return element(by.css(config.gender));
};

ProfilePage.prototype.getBodyHeight = function() {
    return element(by.css(config.bodyHeight));
};

ProfilePage.prototype.getWeight = function() {
    return element(by.css(config.weight));
};

ProfilePage.prototype.getChest = function() {
    return element(by.css(config.chest));
};

ProfilePage.prototype.getWaist = function() {
    return element(by.css(config.waist));
};

ProfilePage.prototype.getHips = function() {
    return element(by.css(config.hips));
};

ProfilePage.prototype.getShoeSize = function() {
    return element(by.css(config.shoeSize));
};

ProfilePage.prototype.getColors = function() {
    return element.all(by.repeater(config.colors));
};

module.exports = ProfilePage;