(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name Shopeur.LanguageService
     * @description
     * # LanguageService
     *
     * @returns {{setLanguages: Function, $get: Function}}
     * @constructor
     */
    function LanguageService() {

        /**
         * Available languages
         * @type {null}
         * @private
         */
        var _languages = null;

        /**
         * Returns available languages as array from const LANGUAGES
         * @returns {Array}
         */
        function getAll(options) {
            var languages = Object.keys(_languages).map(function (key) {
                var langKey = _languages[key];
                if (options && options.shortMode) {
                    langKey = langKey.substring(0, 2);
                }
                return langKey;
            });
            return languages;
        }

        return {
            setLanguages: function (value) {
                _languages = value;
            },

            $get: function () {
                return {
                    getAll: getAll,
                    languages: _languages
                };
            }
        };
    }

    LanguageService.$inject = [];

    angular
        .module('Shopeur')
        .provider('LanguageService', LanguageService);
})();
