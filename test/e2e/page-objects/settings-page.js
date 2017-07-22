var baseConfig = require('../config');
var path = require('path');
var fs = require('fs');

var config = {
    settingsPageUrl: baseConfig.pageBaseUrl + '/app/settings',
    versionFilePath: path.resolve('/data/www/version'),
    versionElement: 'span.item-note'
};

function SettingsPage() {}

SettingsPage.prototype.open = function() {
    browser.get(config.settingsPageUrl);
};

SettingsPage.prototype.getVersionElement = function() {
    return element(by.css(config.versionElement));
};

SettingsPage.prototype.getAppVersion = function() {
    return fs.readFileSync(config.versionFilePath, 'utf8').trim();
};

module.exports = SettingsPage;