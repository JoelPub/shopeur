(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.util:lodash
     * @description
     * # Lo-Dash
     * Expose Lo-Dash through injectable factory, so we don't pollute / rely on global namespace
     * just inject lodash as _
     *
     * @param $window
     * @returns {*}
     */
    function lodash($window) {
        return $window._;
    }

    lodash.$inject = [
        '$window'
    ];

    angular
        .module('Shopeur')
        .factory('_', lodash);
})();