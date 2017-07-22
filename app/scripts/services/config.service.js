(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name Shopeur.ConfigService
     * @description
     * # ConfigService
     *
     * @param $window
     * @param $q
     * @returns {{parse: parse, getAppId: getAppId, getAppVersion: getAppVersion, getAppBuild: getAppBuild}}
     * @constructor
     */
    function ConfigService($window, $q) {

        /**
         * App info object
         * @type {null}
         * @private
         */
        var _appInfo = null;

        /**
         * Parse config xml file
         * @returns {*}
         */
        function parse() {

            var defer = $q.defer();

            if (!$window.navigator.appInfo) {
                defer.reject('"cordova-plugin-appinfo" only works on a device or "cordova-plugin-appinfo" is not installed!');
            } else {
                $window.navigator.appInfo.getAppInfo(function (appInfo) {
                    _appInfo = appInfo;
                    defer.resolve(appInfo);
                }, function (error) {
                    defer.reject(error);
                });
            }

            return defer.promise;
        }

        /**
         * Returns the app id
         * @returns {string}
         */
        function getAppId() {

            if (!_appInfo) {
                return false;
            }

            return _appInfo.identifier;
        }

        /**
         * Returns the app version
         * @returns {string}
         */
        function getAppVersion() {

            if (!_appInfo) {
                return false;
            }

            return _appInfo.version;
        }

        /**
         * Returns the app build
         * @returns {string}
         */
        function getAppBuild() {

            if (!_appInfo) {
                return false;
            }

            return _appInfo.build;
        }

        return {
            parse: parse,
            getAppId: getAppId,
            getAppVersion: getAppVersion,
            getAppBuild: getAppBuild
        };
    }

    ConfigService.$inject = [
        '$window',
        '$q'
    ];

    angular
        .module('Shopeur')
        .factory('ConfigService', ConfigService);
})();
