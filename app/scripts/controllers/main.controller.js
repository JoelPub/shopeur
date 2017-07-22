(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:MainCtrl
     * @description
     * # MainCtrl
     *
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $sce
     * @param $translate
     * @param $ionicModal
     * @param $ionicLoading
     * @param $ionicPopup
     * @param AuthenticateService
     * @param StateHistoryService
     * @param LocalStorageService
     * @param ApiService
     * @param SocialSharingService
     * @constructor
     */
    function MainCtrl($scope, $rootScope, $state, $sce, $translate, $ionicModal, $ionicLoading, $ionicPopup, AuthenticateService, StateHistoryService, LocalStorageService, ApiService, SocialSharingService) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Is logged in state
         * @type {null}
         */
        vm.isLoggedIn = null;

        /**
         * Menu items
         * @type {null}
         */
        vm.menuItems = null;

        /**
         * Current nav / header title
         * @type {string}
         */
        vm.navTitle = '';

        /**
         * Orders modal
         * @type {null}
         */
        vm.modal = null;

        /**
         * inAppBrowser / iFrame url
         * @type {null}
         */
        vm.url = null;

        /**
         * Template url for loading message
         * @type {string}
         */
        vm.templateUrl = '';

        /**
         * Template text for loading message
         * @type {string}
         */
        vm.templateMsg = '';

        /**
         * Template ProgressBar value
         * @type {number}
         */
        vm.templateProgress = 0;

        /**
         * Pre-order trip
         * @type {null}
         */
        vm.trip = null;

        /**
         * InAppBrowser reference
         * @type {null}
         */
        var iab = null;
        var iabTitle = null;

        /**
         * Custom css text string
         * @type {string}
         */
        //var customCSS = null;

        /**
         * Pre-order count
         * @type {number}
         */
        var count = 0;

        /**
         * Return index from object
         * @param arr
         * @param str
         * @returns {*}
         */
        function getStateIndex(arr, str) {
            return arr.map(function (e) {
                    return e.name;
                }
            ).indexOf(str);
        }

        /**
         * Get all menu items after home state index
         * @param states
         * @returns {*}
         */
        function getMenuItems(states) {
            var pos = getStateIndex(states, 'app.home');
            return states.slice(pos);
        }

        /**
         * Get / Set the header title by current state
         * @returns {*}
         */
        function getNavTitle() {
            var title = '';
            switch ($state.current.id) {
                case 'home':
                    title = '';
                    break;
                case 'trip':
                    title = (vm.tripEditMode) ? $translate.instant('menu.edit-trip') : $translate.instant('menu.new-trip');
                    break;
                case 'product':
                    title = (vm.productEditMode) ? $translate.instant('menu.edit-product') : $translate.instant('menu.new-product');
                    break;
                default:
                    title = $translate.instant('menu.' + $state.current.id);
                    break;
            }

            return title;
        }

        /**
         * Return parsed url
         * @param url
         * @returns {Url}
         */
        function parseUrl(url) {
            return new URL(url);
        }

        /**
         * Controller activation promises
         */
        function activate() {
            vm.isLoggedIn = AuthenticateService.isAuthenticated();
            vm.menuItems = getMenuItems($state.get());
        }

        activate();

        /**
         * Auth service event handler
         */
        $rootScope.$on('authenticateServiceEvent', function (event, value) {
            //console.log('** authenticateServiceEvent', value);
            vm.isLoggedIn = value;
        });

        /**
         * On before enter view handler
         */
        $rootScope.$on('$ionicView.beforeEnter', function () {
            //console.log('state id', $state.current.id);

            vm.navTitle = getNavTitle();

            //Show QE buttons
            vm.showQRButton = (
                $state.current.id === 'home'
            );

            //Show Cancel buttons
            vm.showCancelButton = (
                $state.current.id === 'edit-profile' ||
                $state.current.id === 'account-settings' ||
                $state.current.id === 'product' ||
                $state.current.id === 'trip'
            );

            //Show Back buttons
            vm.showBackButton = (
                $state.current.id === 'login' ||
                $state.current.id === 'sign-up' ||
                $state.current.id === 'trip-detail'
            );

            vm.showMenuButton = (
                $state.current.id === 'qrcode' ||
                $state.current.id === 'profile' ||
                $state.current.id === 'story' ||
                $state.current.id === 'about' ||
                $state.current.id === 'home' ||
                $state.current.id === 'contact' ||
                $state.current.id === 'inspired' ||
                $state.current.id === 'settings' ||
                $state.current.id === 'trips' ||
                $state.current.id === 'wishlist' ||
                $state.current.id === 'tax-refund' ||
                $state.current.id === 'orders'
            );

            //Show titles
            vm.showNavTitle = (
                $state.current.id !== 'home' &&
                $state.current.id !== 'inspired'
            );

            //Show right buttons
            vm.showSaveProfileButton =          ($state.current.id === 'edit-profile');
            vm.showSaveAccountSettingsButton =  ($state.current.id === 'account-settings');
            vm.showNewProductButton =           ($state.current.id === 'wishlist');
            vm.showCreateProductButton =        ($state.current.id === 'product');
            vm.showUpdateProductButton =        ($state.current.id === 'product');
            vm.showNewTripButton =              ($state.current.id === 'trips' || $state.current.id === 'orders');
            vm.showCreateTripButton =           ($state.current.id === 'trip');
            vm.showUpdateTripButton =           ($state.current.id === 'trip');

            //Hide footer nav
            vm.hideFooterNav = (
                $state.current.id === 'login' ||
                $state.current.id === 'sign-up' ||
                $state.current.id === 'welcome' ||
                $state.current.id === 'trip' ||
                $state.current.id === 'product' ||
                $state.current.id === 'edit-profile'
            );

            //Highlight trips / trip-detail nav item
            vm.highlightTripsNavItem = (
                $state.current.id === 'trips' ||
                $state.current.id === 'trip-detail'
            );
        });

        /**
         * Tells productCtrl that editMode is true
         */
        vm.newProduct = function () {
            vm.editMode = false;
            $rootScope.$emit('editModeEvent', vm.editMode);
            $state.go('app.product', {data: null});
        };

        /**
         * Header back button handler
         */
        vm.goBack = function () {
            switch($state.current.id) {
                case 'trip-detail':
                    $state.go('app.trips', {data: null});
                    break;
                default:
                    StateHistoryService.goBack();
                    break;
            }
        };

        /**
         * Main click handler
         * @param $event
         */
        vm.clickHandler = function ($event) {
            //console.log("clickHandler was triggered", $event);

            switch ($event.target.id) {

                case 'saveProfileButton':
                    $rootScope.$emit('saveProfileEvent');
                    break;

                case 'saveAccountSettingsButton':
                    $rootScope.$emit('saveAccountSettingsEvent');
                    break;

                case 'newProductButton':
                    $rootScope.$emit('newProductEvent');
                    break;

                case 'createProductButton':
                    $rootScope.$broadcast('createProductEvent');
                    break;

                case 'updateProductButton':
                    $rootScope.$broadcast('updateProductEvent');
                    break;

                case 'newTripButton':
                    $rootScope.$emit('newTripEvent');
                    break;

                case 'createTripButton':
                    $rootScope.$emit('createTripEvent');
                    break;

                case 'updateTripButton':
                    $rootScope.$emit('updateTripEvent');
                    break;

                default:
                    //---
                    break;
            }
        };

        /**
         * Edit mode event listener
         * @type {*|(function())}
         */
        vm.editModeListener = $rootScope.$on('editModeEvent',
            function (event, status) {
                vm.tripEditMode = status;
                vm.productEditMode = status;
            }
        );

        /**
         * Close & reset "InAppBrowser", hide "IonicLoading"
         */
        function closeInAppBrowser() {
            iab.close();
            iab = null;

            $ionicLoading.hide();
        }

        /**
         * InAppBrowser load error callback
         * @param error
         */
        function loadErrorCallback(error) {
            //console.error('InAppBrowser error => ', error);

            closeInAppBrowser();

            $ionicPopup.alert({
                title: $translate.instant('global.error'),
                template: error.message,
                okType: 'button-calm'
            });
        }

        /**
         * InAppBrowser load start callback
         * @param event
         */
        function loadStartCallback(event) {
            console.info('loadstartCallback => ', event);

            vm.templateMsg = parseUrl(event.url).hostname;

            count++;
            vm.templateProgress = count * Math.floor((Math.random() * 6) + 15);

            $ionicLoading.show({
                scope: $scope,
                templateUrl: vm.templateUrl
            });

            var url = parseUrl(event.url);
            if(!url.hostname.includes('192.168') && !url.hostname.includes('oneba.se')) {
                iab.hide();
            }
        }

        /**
         * Message handler to communicate between app and webview
         * @param message
         */
        function messageHandler(message) {
            if (message[0]) {
                var data = JSON.parse(message[0]);
                console.info('de.hrzg.shopeur.message data =>', data);

                //var productImageUrl = ApiService.baseApiUrl() + data.image_file;
                var userProfileUrl = ApiService.baseApiUrl() + '/en/profile/show?id=' + data.id + '&storeId=' + data.destination_id;
                var info = 'User Id: ' + data.id + '\n' +
                    'Trip id: ' + data.user_trip_id + '\n' +
                    'Product Id: ' + data.name_id + '\n\n';

                closeInAppBrowser();

                SocialSharingService.shareVia('com.tencent.mm', info, null, null, userProfileUrl);
            }
        }

        /**
         * InAppBrowser load stop callback
         * @param event
         */
        function loadStopCallback(event) {
            console.info('loadStopCallback => ', event);
            
            count = 0;
            iab.show();

            iab.executeScript(
                {
                    code: 'sessionStorage.getItem("de.hrzg.shopeur.message")'
                },
                messageHandler
            );
        }

        /**
         * InAppBrowser exit callback
         */
        function exitCallback() {
            $ionicLoading.hide();
            //$state.go('app.home');
        }

        /**
         * Open inAppBrowser
         * Is cordova not defined (e.g. Desktop-Browser) show iframe as fallback
         */
        vm.openInAppBrowser = function(trip) {
            var token = LocalStorageService.getItem('access_token');

            if (trip) {
                vm.trip = trip;
                var lastPreorder = vm.trip.doc.preorders[vm.trip.doc.preorders.length - 1];
                vm.url = $sce.trustAsResourceUrl(ApiService.baseApiUrl() + '/en/mobile/customer/trip?access_token=' + token + '&user_trip_id=' + lastPreorder.user_trip_id);
                vm.templateUrl = 'templates/loading/alipay.html';
                iabTitle = 'PAYMENT';
            } else {
                vm.url = $sce.trustAsResourceUrl(ApiService.baseApiUrl() + '/en/mobile/customer?access_token=' + token);
                vm.templateUrl = 'templates/loading/request.html';
                iabTitle = 'PRE-ORDERS';
            }

            if (!window.cordova) {
                $ionicModal.fromTemplateUrl('templates/modals/iframe.html', {
                    scope: $scope,
                    animation: 'scale-in',
                    backdropClickToClose: true
                }).then(function(modal) {
                    vm.modal = modal;
                    vm.modal.show();
                });
            } else {
                //iab = cordova.InAppBrowser.open(vm.url, '_blank', 'location=no,zoom=no,hardwareback=no,hidden=true');
                iab = cordova.ThemeableBrowser.open(vm.url, '_blank', {
                    toolbar: {
                        height: 44,
                        color: '#a2d1cb'
                    },
                    title: {
                        color: '#ffffff',
                        //staticText: iabTitle,
                        showPageTitle: false
                    },
                    closeButton: {
                        wwwImage: 'assets/images/iab-close-button.png',
                        wwwImageDensity: 2,
                        align: 'left',
                        event: 'closePressed'
                    },
                    backButtonCanClose: true,
                    hidden: true
                });

                iab.addEventListener('loaderror', loadErrorCallback);
                iab.addEventListener('loadstart', loadStartCallback);
                iab.addEventListener('loadstop', loadStopCallback);
                iab.addEventListener('exit', exitCallback);
                /*iab.addEventListener(cordova.ThemeableBrowser.EVT_ERR, function (event) {
                    console.error(event.message);
                });
                iab.addEventListener(cordova.ThemeableBrowser.EVT_WRN, function (event) {
                    console.warn(event.message);
                });*/
            }
        };

        /**
         * Close store info
         */
        vm.closePopUp = function () {
            vm.modal.hide();
            vm.modal.remove();
            vm.modal = null;
        };

        /**
         * Cancel Payment handler
         */
        vm.cancelPayment = function() {
            closeInAppBrowser();
        };

        /**
         * Pre-order event handler
         */
        $rootScope.$on('preorderCompleteEvent', function (event, args) {
            console.info('preorderCompleteEvent =>', args);
            vm.openInAppBrowser(args.trip);
        });

        /**
         * Need to unbind listeners each time the $scope is destroyed
         */
        $scope.$on('$destroy', vm.editModeListener);
    }

    MainCtrl.$inject = [
        '$scope',
        '$rootScope',
        '$state',
        '$sce',
        '$translate',
        '$ionicModal',
        '$ionicLoading',
        '$ionicPopup',
        'AuthenticateService',
        'StateHistoryService',
        'LocalStorageService',
        'ApiService',
        'SocialSharingService'
    ];

    angular
        .module('Shopeur')
        .controller('MainCtrl', MainCtrl);

})();
