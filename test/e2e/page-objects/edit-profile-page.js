var baseConfig = require('../config');

var config = {

    editPorilegeUrl : baseConfig.pageBaseUrl + '/app/edit-profile',
    headingSelector : 'div[nav-bar="active"] .title.title-center.header-item',
    cancelBtn       : '#cancelButton',
    saveBtn         : '#saveProfileButton',
    activeNavBar    : '.nav-bar-block[nav-bar="active"]',
    firstnameInput  : 'vm.form.forename',
    surnameInput    : 'vm.form.surname',
    dateOfBirth     : 'vm.form.date_of_birth',
    gender          : 'vm.form.gender',
    bodyHeight      : 'vm.form.body_height',
    weight          : 'vm.form.weight',
    chest           : 'vm.form.chest',
    waist           : 'vm.form.waist',
    hips            : 'vm.form.hips',
    shoeSize        : 'vm.form.shoe_size',
    color           : '.item-checkbox',
    profileAlert    : '.popup'
};

function EditProfilePage() {}

EditProfilePage.prototype.open = function() {
    browser.get(config.editPorilegeUrl);
};

EditProfilePage.prototype.getCancelBtn = function() {
    return element(by.css(config.activeNavBar)).element(by.css(config.cancelBtn));
};

EditProfilePage.prototype.saveBtn = function() {
    return element(by.css(config.activeNavBar)).element(by.css(config.saveBtn));
};

EditProfilePage.prototype.getFirstname = function() {
    return element(by.model(config.firstnameInput));
};

EditProfilePage.prototype.getSurnamename = function() {
    return element(by.model(config.surnameInput));
};

EditProfilePage.prototype.getDateOfBirth = function() {
    return element(by.model(config.dateOfBirth));
};

EditProfilePage.prototype.getGender = function() {
    return element(by.model(config.gender)).all(by.css('option'));
};

EditProfilePage.prototype.getBodyHeight = function() {
    return element(by.model(config.bodyHeight));
};

EditProfilePage.prototype.getWeight = function() {
    return element(by.model(config.weight));
};

EditProfilePage.prototype.getChest = function() {
    return element(by.model(config.chest));
};

EditProfilePage.prototype.getWaist = function() {
    return element(by.model(config.waist));
};

EditProfilePage.prototype.getHips = function() {
    return element(by.model(config.hips));
};

EditProfilePage.prototype.getShoeSize = function() {
    return element(by.model(config.shoeSize));
};

EditProfilePage.prototype.getColors = function() {
    return element.all(by.css(config.color));
};

EditProfilePage.prototype.getProfileAlert = function () {
    return element(by.css(config.profileAlert));
};

module.exports = EditProfilePage;