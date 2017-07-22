(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:QrcodeCtrl
     * @description
     * # QrcodeCtrl
     *
     * @param $scope
     * @param ApiService
     * @param ProfileService
     * @param LocalStorageService
     * @constructor
     */
    function QrcodeCtrl($scope, ApiService, ProfileService, LocalStorageService) {

        /**
         * View model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * User profile api url
         * @type {string}
         */
        vm.url = '';

        /**
         * User object from local storage
         * @type {{}}
         */
        vm.user = {};

        /**
         * User name by locale, forename and surname, otherwise the username (email) will be used
         * en, de   => forename surname
         * zh       => surname forename
         * @type {string}
         */
        vm.localeName = '';

        /**
         * On before enter view handler
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            vm.url = ApiService.baseApiUrl() + '/en/profile/show?id=' + vm.userId;
            //console.info('QRCode url => ', vm.url);

            vm.user = LocalStorageService.getItem('user');
            vm.localeName = ProfileService.getLocaleName();
        });
    }

    QrcodeCtrl.$inject = [
        '$scope',
        'ApiService',
        'ProfileService',
        'LocalStorageService'
    ];

    angular
        .module('Shopeur')
        .controller('QrcodeCtrl', QrcodeCtrl);

})();