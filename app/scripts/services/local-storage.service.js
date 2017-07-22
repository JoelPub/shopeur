(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:LocalStorageService
     * @description
     * # LocalStorageService, get, set and remove from localStorage
     *
     * @param ConfigService
     * @returns {{getItem: getItem, setItem: setItem, removeItem: removeItem}}
     * @constructor
     */
    function LocalStorageService(ConfigService) {

        var STORAGE_KEY = ConfigService.getAppId() ? ConfigService.getAppId() : 'de.hrzg.shopeur';

        /**
         * Get item from localStorage
         * @param key
         * @returns {boolean}
         */
        function getItem(key) {
            var value = window.localStorage.getItem(STORAGE_KEY + '.' + key);
            if (value) {
                return JSON.parse(value);
            }

            return false;
        }

        /**
         * Add item to localStorage
         * @param key
         * @param value
         */
        function setItem(key, value) {
            window.localStorage.setItem(STORAGE_KEY + '.' + key, JSON.stringify(value));
        }

        /**
         * Remove item from local storage
         * @param key
         */
        function removeItem(key) {
            window.localStorage.removeItem(STORAGE_KEY + '.' + key);
        }

        return {
            getItem: getItem,
            setItem: setItem,
            removeItem: removeItem
        };
    }

    LocalStorageService.$inject = [
        'ConfigService'
    ];

    angular
        .module('Shopeur')
        .factory('LocalStorageService', LocalStorageService);
})();