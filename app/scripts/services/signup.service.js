(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:SignupService
     * @description
     * # SignupService
     *
     * @param ApiService
     * @param $q
     * @returns {{success: success, register: register}}
     * @constructor
     */
    function SignupService(ApiService, $q) {

        /**
         * Success state
         * @type {boolean}
         * @private
         */
        var _success = false;

        /**
         * Get success state
         * @returns {boolean}
         */
        function success() {
            return _success;
        }

        /**
         * API registration
         * @param user
         * @returns {*}
         */
        function register(user) {
            var defer = $q.defer();
            // ApiService.post('api/v1/register', user, {sendToken: false})
            ApiService.get('pRa85y/f5d7cf8c1bee9f7c218ec995478cdea37edfa299/files/snippet.json', user, {sendToken: false})
                .then(function (res) {
                    _success = (res.data.id > 0);
                    defer.resolve(res);
                })
                .catch(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        }

        return {
            success: success,
            register: register
        };
    }

    SignupService.$inject = [
        'ApiService',
        '$q'
    ];

    angular.module('Shopeur')
        .factory('SignupService', SignupService);
})();
