(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name Shopeur.directive:translations
     *
     * @param $translate
     * @returns {{scope: {translations: string, field: string}, link: link}}
     */
    function translations($translate) {

        /**
         * Get translation, fallback or missing string
         * @param scope
         * @param langKey
         * @returns {*}
         */
        function getTranslation(scope, langKey) {

            var translation = null;

            /**
             * Check if a translation for the lang key exists
             * if not, use the english one
             */
            if (scope.translations[langKey]) {
                translation = scope.translations[langKey];
            } else {
                /* jshint -W069 */
                translation = scope.translations['en'];
            }

            return (translation[scope.field]) ? translation[scope.field] : '!! Missing Field Translation !!';
        }

        /**
         * Link function
         * @param scope
         * @param element
         */
        function link (scope, element) {

            if (!scope.translations || !scope.field) {
                element.html('!! Missing Translation Params !!');
                return;
            }

            var translation = getTranslation(scope, $translate.use().substring(0, 2));
            element.html(translation);

            /**
             * Watcher for translations object
             */
            scope.$watch('translations', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    var translation = getTranslation(scope, $translate.use().substring(0, 2));
                    element.html(translation);
                }
            }, true);

            /**
             * Watcher for language
             * Using a function as a watchExpression
             */
            scope.$watch(
                // This function returns the language being watched.
                // It is called for each turn of the $digest loop
                function(){
                    return $translate.use().substring(0, 2);
                },
                // This is the change listener, called when the value returned from the above function changes
                function(newLang, oldLang) {
                    if (newLang !== oldLang) {
                        // Only update translation if language changed
                        var translation = getTranslation(scope, newLang);
                        element.html(translation);
                    }
            }, true);
        }

        return {
            scope: {
                translations: '=',
                field: '@'
            },
            link: link
        };
    }

    translations.$inject = [
        '$translate'
    ];

    angular.module('Shopeur')
        .directive('translations', translations);

})();
