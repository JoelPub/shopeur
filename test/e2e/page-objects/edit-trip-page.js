var baseConfig = require('../config');

var config = {
    pageUrl: baseConfig.pageBaseUrl + '/app/edit-trip',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    cancelButtonSelector: '.button.cancel',
    saveButtonSelector: '.button.save'
};

function EditTripPage() {}

EditTripPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

EditTripPage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

EditTripPage.prototype.getCancelButton = function() {
    return element(by.css(config.cancelButtonSelector));
};

EditTripPage.prototype.getSaveButton = function() {
    return element(by.css(config.saveButtonSelector));
};

module.exports = EditTripPage;