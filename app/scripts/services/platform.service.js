(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name Shopeur.PlatformService
     * @description
     * # PlatformService
     *
     * @returns {{isWebView: isWebView, isIPad: isIPad, isIOS: isIOS, isAndroid: isAndroid, isWindowsPhone: isWindowsPhone, getPlatform: getPlatform}}
     * @constructor
     */
    function PlatformService() {

        /**
         * Is web view
         * @returns {*}
         */
        function isWebView() {
            return ionic.Platform.isWebView();
        }

        /**
         * Is iPad
         * @returns {*}
         */
        function isIPad() {
            return ionic.Platform.isIPad();
        }

        /**
         * Is iOS
         * @returns {*}
         */
        function isIOS() {
            return ionic.Platform.isIOS();
        }

        /**
         * Is android
         * @returns {*}
         */
        function isAndroid() {
            return ionic.Platform.isAndroid();
        }

        /**
         * Is windows phone
         * @returns {*}
         */
        function isWindowsPhone() {
            return ionic.Platform.isWindowsPhone();
        }

        /**
         * Get platform informations
         * @returns {{device: *, platform: *, version: *, isWebView: *, isIPad: *, isIOS: *, isAndroid: *, isWindwosPhone: *}}
         */
        function getPlatform() {
            var device = ionic.Platform.device();
            var platform = ionic.Platform.platform();
            var version = ionic.Platform.version();

            return {
                'device': device,
                'platform': platform,
                'version': version,
                'isWebView': isWebView(),
                'isIPad': isIPad(),
                'isIOS': isIOS(),
                'isAndroid': isAndroid(),
                'isWindwosPhone': isWindowsPhone()
            };
        }

        return {
            isWebView: isWebView,
            isIPad: isIPad,
            isIOS: isIOS,
            isAndroid: isAndroid,
            isWindowsPhone: isWindowsPhone,
            getPlatform: getPlatform
        };
    }

    PlatformService.$inject = [];

    angular
        .module('Shopeur')
        .factory('PlatformService', PlatformService);
})();
