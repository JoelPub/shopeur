var baseConfig = require('../config');

var config = {

    sideMenuToggle : '#sideMenuToggle',
    sideMenuItems  : 'item in vm.menuItems',
    activeNavBar   : '.nav-bar-block[nav-bar="active"]'

};

function SideMenu() {}

SideMenu.prototype.sideMenuToggle = function() {
    return element(by.css(config.activeNavBar)).element(by.css(config.sideMenuToggle));
    //return element(by.css(config.sideMenuToggle));
};


SideMenu.prototype.sideMenuItems = function() {
    return element.all(by.repeater(config.sideMenuItems));
};

module.exports = SideMenu;