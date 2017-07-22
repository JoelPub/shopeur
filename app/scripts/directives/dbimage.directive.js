(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name Shopeur.directive:dbImg
     *
     * @description
     * Replace the image src attribute with the stored attachment
     *
     * @param PouchDBService
     * @returns {{restrict: string, scope: {docId: string, attachmentId: string}, link: link}}
     */
    function dbImg(PouchDBService) {

        /**
         * Update the image src attribute
         * @param scope
         * @param element
         */
        function updateImageSrc(scope, element) {

            /**
             * Split the path prefix to get the pure filename which represents the attachment id
             * @type {Array}
             */
            var attachmentId = scope.attachmentId.split('/').pop();

            PouchDBService.getAttachment(scope.docId, attachmentId)
                .then(function (blob) {

                    var reader = new FileReader();

                    //element[0].classList.add('db-image');
                    //element[0].classList.add('hidden');

                    reader.onload = function () {
                        element[0].src = reader.result;
                        //element[0].classList.remove('hidden');
                    };

                    // Convert to base64 using the file reader
                    reader.readAsDataURL(blob);
                })
                .catch(function (error) {
                    console.warn('get attachment error => ', error);
                });
        }

        /**
         * Directive link function
         * Show a broken image if one of the required attributes are empty
         * @param $scope
         * @param $element
         */
        function link($scope, $element) {

            if (!$scope.docId || !$scope.attachmentId) {
                // Set the source to something that doesn't exist in order to show the broken image icon
                $element[0].src = 'broken-img.jpg';
                return;
            }

            updateImageSrc($scope, $element);

            /**
             * Watcher for "docId"
             */
            $scope.$watch('docId', function (newVal, oldVal) {
                if(newVal !== oldVal) {
                    updateImageSrc($scope, $element);
                }
            });
        }

        return {
            restrict: 'A',
            scope: {
                docId: '=',
                attachmentId: '='
            },
            link: link
        };
    }

    dbImg.$inject = [
        'PouchDBService'
    ];

    angular.module('Shopeur')
        .directive('dbImg', dbImg);

})();