(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:HomeCtrl
     * @description
     * # HomeCtrl
     *
     * @param $scope
     * @param $state
     * @param $timeout
     * @param $ionicLoading
     * @param $ionicSlideBoxDelegate
     * @param StoryService
     * @param InspiredService
     * @param ProfileService
     * @param SocialSharingService
     * @param NotificationService
     * @param PouchDBService
     * @constructor
     */
    function HomeCtrl($scope, $state, $timeout, $ionicLoading, $ionicSlideBoxDelegate, StoryService, InspiredService, ProfileService, SocialSharingService, NotificationService, PouchDBService) {

        /**
         * The view model
         * @type {Shopeur.controller}
         */
        var vm = this;

        /**
         * Story list
         * @type {Array}
         */
        vm.stories = [];

        /**
         * Inspired list
         * @type {Array}
         */
        vm.inspirations = [];

        /**
         * Notification list
         * @type {Array}
         */
        vm.notifications = [];

        /**
         * User profile
         * @type {null}
         */
        vm.profile = null;

        /**
         * User avatar
         * @type {string}
         */
        vm.avatar = '';

        /**
         * User welcome message
         * @type {string}
         */
        vm.message = '';

        /**
         * User name by locale, forename and surname, otherwise the username (email) will be used
         * en, de   => forename surname
         * zh       => surname forename
         * @type {string}
         */
        vm.localeName = '';

        /**
         * Go to a Story
         * @param story
         */
        vm.gotoStory = function (story) {
            $state.go('app.story', {data: story});
        };

        /**
         * Check visibility of notification view
         * @returns {number|Number}
         */
        vm.hasNotifications = function () {
            return (NotificationService.hasWishlistEntries() || NotificationService.hasTriplistEntries());
        };

        /**
         * Navigate to wishlist or trip detail view
         * @param type
         */
        vm.goToNotification = function (type) {
            switch (type) {
                case 'wishlist':
                    $state.go('app.wishlist');
                    break;
                case 'trip':
                    $state.go('app.trip-detail', {data: NotificationService.getNextTrip()});
                    break;
            }
        };

        /**
         * Social sharing method, see "SocialSharingService" description for "share()" method params
         * Available share methods: share(), shareVia(), canShareVia(), shareWithOptions() and shareViaWhatsApp()
         */
        vm.socialSharing = function () {
            SocialSharingService.share('I like shopeur.com!', null, null, 'http://www.shopeur.com');
        };

        /**
         * Update and restart slider
         * @param handle
         * @param data
         * @param doesContinue
         */
        function updateSlider(handle, data, doesContinue) {
            /**
             * NOTE: Workaround to fix ion-slide-box with two slides and does-continue bug
             * https://github.com/driftyco/ionic/issues/3609
             * https://github.com/driftyco/ionic/issues/1353
             */
            if(data.length === 2) {
                var clone = data.slice();
                data.push(clone[0], clone[1]);
            }

            $timeout(function() {
                $ionicSlideBoxDelegate.$getByHandle(handle).update();
                if(doesContinue) {
                    $ionicSlideBoxDelegate.$getByHandle(handle).start();
                    $ionicSlideBoxDelegate.$getByHandle(handle).loop(true);
                }
            }, 50);
        }

        /**
         * Refresh data when this page is active, listen to the $ionicView.beforeEnter event:
         * http://ionicframework.com/docs/api/directive/ionView/
         */
        $scope.$on('$ionicView.beforeEnter', function () {

            // Check if db changes available
            PouchDBService.hasChanges()
                .then(function(info) {
                    if(info.last_seq !== PouchDBService.lastSeq()) {
                        console.info('Received db updates...', info, PouchDBService.lastSeq());

                        $ionicLoading.show({
                            templateUrl: 'templates/loading/sync.html',
                            delay: 500
                        });

                        return PouchDBService.sync();
                    }
                })
                .then(function() {

                    $ionicLoading.hide();

                    //vm.inspirations = InspiredService.getAll();
                    vm.message = ProfileService.getMessage();

                    ProfileService.getProfile()
                        .then(function (response) {
                            vm.profile = response.profile;
                            vm.avatar = response.image  + '?rand=' + new Date().getTime();
                            vm.localeName = ProfileService.getLocaleName();
                        });

                    StoryService.getAll()
                        .then(function (response) {

                            vm.stories = response.rows;

                            if(vm.stories.length) {
                                updateSlider('storySlides', vm.stories, false);
                            }
                        });

                    NotificationService.getNotifications()
                        .then(function (response) {

                            vm.notifications = response;

                            if(vm.notifications.length) {
                                updateSlider('notificationSlides', vm.notifications, true);
                            }
                        });
                })
                .catch(function(error) {
                    console.warn('Db update error', error);
                    $ionicLoading.hide();
                });
        });
    }

    HomeCtrl.$inject = [
        '$scope',
        '$state',
        '$timeout',
        '$ionicLoading',
        '$ionicSlideBoxDelegate',
        'StoryService',
        'InspiredService',
        'ProfileService',
        'SocialSharingService',
        'NotificationService',
        'PouchDBService'
    ];

    angular
        .module('Shopeur')
        .controller('HomeCtrl', HomeCtrl);

})();
