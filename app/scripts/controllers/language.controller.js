(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:LanguageCtrl
     * @description
     * # LanguageCtrl
     *
     * @param $translate
     * @param tmhDynamicLocale
     * @param LanguageService
     * @constructor
     */
    function LanguageCtrl($translate, tmhDynamicLocale, LanguageService) {

        var vm = this;
        vm.availible = [];
        vm.selected = null;

        /**
         * Switch current language
         */
        vm.switchTo = function () {
            tmhDynamicLocale.set(vm.availible[vm.selected]);
            $translate.use(vm.availible[vm.selected]);
        };

        /**
         * Get current language
         * @returns {*}
         */
        vm.getCurrent = function () {
            return $translate.use();
        };

        /**
         * Controller activation promises
         */
        function activate() {
            //console.log(languageService.getAll);
            //console.log(languageService.languages);

            // TODO: check if language is stored

            vm.availible = LanguageService.getAll();
            vm.selected = vm.availible.indexOf($translate.use());
        }

        activate();
    }

    LanguageCtrl.$inject = [
        '$translate',
        'tmhDynamicLocale',
        'LanguageService'
    ];

    angular
        .module('Shopeur')
        .controller('LanguageCtrl', LanguageCtrl);

})();
