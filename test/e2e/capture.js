var fs = require('fs');
var path = require('path');
var screenshotPath = __dirname + '/../screenshots/';

function capture(img) {
    ensureExists(screenshotPath, 0744, function(error) {
        if (error) {
            // handle error
        } else {
            browser.takeScreenshot().then(function(png) {
                var file = path.resolve(screenshotPath + img);
                fs.writeFileSync(file, png, {encoding: 'base64'}, console.log);
            });
        }
    });
}

function ensureExists(path, mask, cb) {
    // allow the `mask` parameter to be optional
    if (typeof mask == 'function') {
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function(error) {
        if (error) {
            // ignore the error if the folder already exists
            if (error.code == 'EEXIST') {
                cb(null);
            } else {
                // something else went wrong
                cb(error);
            }
        } else {
            // successfully created folder
            cb(null);
        }
    });
}

exports.takeScreenshot = function (img) {
    capture(img);
};
