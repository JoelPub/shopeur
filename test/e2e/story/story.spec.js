var StoryPage = require('../page-objects/story-page');

describe('story view', function() {

    var page;

    beforeEach(function() {
        page = new StoryPage();
        page.open();
    });

    /*it('should show a proper heading', function() {
        expect(page.getHeading().getText()).toBe('Story');
    });*/

    it('should go to startscreen page', function() {

        var backBtn = page.getBackButton();
        expect(backBtn.isPresent);

        backBtn.isDisplayed().then(function(visible) {
            if (visible) {
                backBtn.click();
                expect(browser.getCurrentUrl()).toContain('#/app/home');
            }
        })
    });

    it('should have "more stories"', function() {

        var story = page.getStory();
        expect(story.isPresent);

    });

});