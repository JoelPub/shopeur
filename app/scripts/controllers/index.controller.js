(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:IndexCtrl
     * @description
     * # IndexCtrl
     *
     * @param $sce
     * @param GOOGLE_API
     * @constructor
     */
    function IndexCtrl($sce, GOOGLE_API) {

        var vm = this;

        /**
         * Google api credentials
         * @type {{key: *, url: string}}
         */
        vm.google = {
            key: GOOGLE_API.key,
            url: 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_API.key
        };

        /**
         * Get trusted google url
         * @returns {*}
         */
        vm.googleUrl = function () {
            return $sce.trustAsResourceUrl(vm.google.url);
        };
    }

    IndexCtrl.$inject = [
        '$sce',
        'GOOGLE_API'
    ];

    angular
        .module('Shopeur')
        .controller('IndexCtrl', IndexCtrl);

})();
