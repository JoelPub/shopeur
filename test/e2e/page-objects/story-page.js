var config = {
    pageUrl: 'http://web/#/app/story',
    headingSelector: 'div[nav-bar="active"] .title.title-center.header-item',
    backButtonSelector: '.button.back',
    storySelector: '.story'
};

function StoryPage() {}

StoryPage.prototype.open = function() {
    browser.get(config.pageUrl);
};

StoryPage.prototype.getHeading = function() {
    return element(by.css(config.headingSelector));
};

StoryPage.prototype.getBackButton = function() {
    return element(by.css(config.backButtonSelector));
};

StoryPage.prototype.getStory = function() {
    return element(by.css(config.storySelector));
};

module.exports = StoryPage;