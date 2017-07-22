var baseConfig = require('../config');

var EditProfilePage = require('../page-objects/edit-profile-page');
var ProfilePage = require('../page-objects/profile-page');
var TestUtil = require('../test-util');

describe('Edit profile view', function () {

    var editProfilePage = new EditProfilePage();
    var profilePage = new ProfilePage();
    var testUtil = new TestUtil();

    var EC = protractor.ExpectedConditions;

    beforeAll(function () {
        testUtil.syncAndLogin();
    });

    it('should cancel update and go back to profile page', function () {

        profilePage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/profile');

        var editProfileBtn = profilePage.getEditProfileBtn();
        expect(editProfileBtn.isPresent()).toBe(true);
        editProfileBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/edit-profile');

        var cancelBtn = editProfilePage.getCancelBtn();
        expect(cancelBtn.isPresent()).toBe(true);
        cancelBtn.click();

        expect(browser.getCurrentUrl()).toContain('#/app/profile');
    });

    it('should update the profile', function () {

        editProfilePage.open();
        expect(browser.getCurrentUrl()).toContain('#/app/edit-profile');

        var firstname = editProfilePage.getFirstname();
        firstname.clear();
        firstname.sendKeys("Chie");

        var surname = editProfilePage.getSurnamename();
        surname.clear();
        surname.sendKeys("Hong");

        var dateOfBirth = editProfilePage.getDateOfBirth();
        dateOfBirth.sendKeys("11281986");

        var gender = editProfilePage.getGender().get(1);
        gender.click();

        var bodyHeight = editProfilePage.getBodyHeight();
        bodyHeight.clear();
        bodyHeight.sendKeys("186");

        var weight = editProfilePage.getWeight();
        weight.clear();
        weight.sendKeys("70");

        var chest = editProfilePage.getChest();
        chest.clear();
        chest.sendKeys("69");

        var waist = editProfilePage.getWaist();
        waist.clear();
        waist.sendKeys("59");

        var hips = editProfilePage.getHips();
        hips.clear();
        hips.sendKeys("69");

        var shoeSize = editProfilePage.getShoeSize();
        shoeSize.clear();
        shoeSize.sendKeys("44");

        //var colors = editProfilePage.getColors();
        //colors.get(0).click();
        //colors.get(1).click();

        var saveBtn = editProfilePage.saveBtn();
        expect(saveBtn.isPresent);
        saveBtn.click();

        var editProfileBtn = profilePage.getEditProfileBtn();
        browser.wait(EC.visibilityOf(editProfileBtn), baseConfig.mediumWaitTimeout);

        expect(browser.getCurrentUrl()).toContain('#/app/profile');
    });
});
