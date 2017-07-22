(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:OrdersCtrl
     * @description
     * # OrdersCtrl
     *
     * @param $scope
     * @param $state
     * @param $sce
     * @param $window
     * @param ApiService
     * @param LocalStorageService
     * @param SocialSharingService
     * @constructor
     */
    function OrdersCtrl($scope, $state, $sce, $window, ApiService, LocalStorageService, SocialSharingService) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Webview / iFrame url
         * @type {null}
         */
        vm.url = null;

        /**
         * Trip for pre-order
         * @type {null}
         */
        vm.trip = null;

        /**
         * Use iFrame or Webview
         * @type {boolean}
         */
        vm.useIFrame = true;

        /**
         * Social sharing method, see "SocialSharingService" description for "share()" method params
         * Available share methods: share(), shareVia(), canShareVia(), shareWithOptions() and shareViaWhatsApp()
         * @param json
         */
        function socialSharing(json) {
            console.info('Social sharing data => ', JSON.parse(json));

            var data = JSON.parse(json);

            // API image url
            //var productImageUrl = ApiService.baseApiUrl() + data.image_file; // => '/s3?file=/shopeur/app/products/Product-DF08762E9BFB7768-image.jpg'

            // AWS S3 Bucket image url
            //var productImageUrl = 'https://s3-eu-west-1.amazonaws.com/de-hrzg-shopeurope/shopeur/app/products/Product-DF08762E9BFB7768-image.jpg';

            // Currently disabled
            var productImageUrl = null;

            var userProfileUrl = ApiService.baseApiUrl() + '/en/profile/show?id=' + data.id + '&storeId=' + data.destination_id;
            var message = 'User Id: ' + data.id + '\n' +
                'Trip id: ' + data.user_trip_id + '\n' +
                'Product Id: ' + data.name_id + '\n\n';

            SocialSharingService.share(message, null, productImageUrl, userProfileUrl);
        }

        /**
         * The window.postMessage() handler safely enables cross-origin communication
         * https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
         * @param event
         */
        function messageHandler(event) {
            //console.log('MessageEvent => ', event);
            //console.log('baseApiUrl => ', ApiService.baseApiUrl());
            if(event.origin !== ApiService.baseApiUrl()) {
                return false;
            }
            socialSharing(event.data);
        }

        /**
         * Controller activation promises
         */
        function activate() {
            vm.token = LocalStorageService.getItem('access_token');
            angular.element($window).on('message', messageHandler);
        }

        activate();

        /**
         * Open inAppBrowser plugin
         * Is cordova not defined (e.g. Desktop-Browser) show iframe as fallback
         */
        /*function openInAppBrowser() {
            if (!window.cordova) {
                vm.useIFrame = true;
            } else {
                var iab = cordova.InAppBrowser.open(vm.url, '_blank', 'location=no,zoom=no,hardwareback=no');
                iab.addEventListener('loaderror', function (error) {
                    console.log(error);
                });
            }
        }*/

        /**
         * On before enter view handler
         * Open user trip list in inAppBrowser / iFrame if "$state.params.data" not available
         * Open user trip detail in inAppBrowser / iFrame if "$state.params.data" available
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            //console.debug('Orders state params => ', $stateParams.data, data.stateParams.data, $state.params.data);

            if ($state.params.data && $state.params.data.trip) {

                vm.trip = $state.params.data.trip;

                var lastPreorder = vm.trip.doc.preorders[vm.trip.doc.preorders.length - 1];
                vm.url = $sce.trustAsResourceUrl(ApiService.baseApiUrl() + '/en/mobile/customer/trip?access_token=' + vm.token + '&user_trip_id=' + lastPreorder.user_trip_id);
            } else {
                vm.url = $sce.trustAsResourceUrl(ApiService.baseApiUrl() + '/en/mobile/customer?access_token=' + vm.token);
            }

            // Use embedded iframe instead of inAppBrowser
            //openInAppBrowser();
        });
    }

    OrdersCtrl.$inject = [
        '$scope',
        '$state',
        '$sce',
        '$window',
        'ApiService',
        'LocalStorageService',
        'SocialSharingService'
    ];

    angular
        .module('Shopeur')
        .controller('OrdersCtrl', OrdersCtrl);

})();
