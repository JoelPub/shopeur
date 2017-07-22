(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name Shopeur.directive:pwCheck
     *
     * @description
     * Password compare
     */
    function pwCheck() {

        /**
         * Directive link function
         * @param scope
         * @param elem
         * @param attr
         * @param ctrl
         */
        function link(scope, elem, attr, ctrl) {

            var pw1 = document.getElementById(attr.pwCheck);
            var pw2 = document.getElementById(attr.id);

            /**
             * Callback function
             */
            function cb() {
                scope.$apply(function () {
                    var v = (pw1.value === pw2.value);
                    ctrl.$setValidity('pwmatch', v);
                });
            }

            pw1.addEventListener('keyup', cb);
            pw2.addEventListener('keyup', cb);
        }

        return {
            require: 'ngModel',
            link: link
        };
    }

    angular.module('Shopeur')
        .directive('pwCheck', pwCheck);

})();