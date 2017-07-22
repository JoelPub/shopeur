(function () {

    'use strict';

    /**
     * @ngdoc overview
     * @name Shopeur
     * @description
     * # Initializes main application and routing
     *
     * Main module of the application.
     */
    angular.module('Shopeur', ['ionic', 'ngCordova', 'pascalprecht.translate', 'ja.qr', 'tmh.dynamicLocale'])

        .run(function ($rootScope, $log, $ionicPlatform, $translate, ConfigService) {

            /**
             * Enable global logging in view files
             */
            $rootScope.$log = $log;

            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }

                ConfigService.parse()
                    .then(function () {
                        console.info('ConfigService.getAppId:', ConfigService.getAppId());
                        console.info('ConfigService.getAppVersion:', ConfigService.getAppVersion());
                        console.info('ConfigService.getAppBuild:', ConfigService.getAppBuild());
                    })
                    .catch(function (error) {
                        console.warn('ConfigService error:', error);
                    });

                if (navigator.globalization) {
                    navigator.globalization.getPreferredLanguage(function(language) {
                        console.info('getPreferredLanguage', language);
                        /*$translate.use(language.value).then(function (data) {
                            console.log('Globalization language', data);
                        }, function (error) {
                            console.log('Globalization error', error);
                        });*/
                    }, null);
                }
            });
        })
        .config(function ($logProvider, $compileProvider, $httpProvider, dbServiceProvider, LANGUAGES, LanguageServiceProvider, $translateProvider, $stateProvider, $urlRouterProvider, ApiServiceProvider, PouchDBServiceProvider, $ionicConfigProvider, tmhDynamicLocaleProvider) {


            /**
             * Return camel cased string
             * @param string
             * @param first
             * @returns {string}
             */
            function camelCase(string, first) {
                return ((first ? '-' : '') + string).replace(/-+([^-])/g, function (a, b) {
                    return b.toUpperCase();
                });
            }

            /**
             * Return view state
             *
             * @param name
             * @param url
             * @param cache
             * @param resolve
             * @returns {{cache: boolean, id: *, url: (*|string), views: {viewContent: {templateUrl: string, controller: string, resolve: *}}}}
             */
            function getState(name, url, cache, resolve) {
                //console.log( camelCase(name, true) + 'Ctrl as ' + camelCase(name, false));

                resolve = (resolve) ? resolve : {init: function() {}};

                return {
                    cache: (cache !== false),
                    id: name,
                    url: url || '/' + name,
                    params: {
                        data: null
                    },
                    views: {
                        'viewContent': {
                            templateUrl: 'templates/views/' + name + '.html',
                            controller: camelCase(name, true) + 'Ctrl as vm',
                            resolve: resolve

                        }
                    }
                };
            }

            /**
             * Returns available languages as array from const LANGUAGES
             * @returns {Array}
             */
            function getLanguages() {
                return Object.keys(LANGUAGES).map(function (key) {
                    return LANGUAGES[key];
                });
            }

            /**
             * Languages mapping for $translateProvider
             * @returns {{}}
             */
            function getTranslateProviderMapping() {
                var mapping = {};

                var keys = Object.keys(LANGUAGES);
                var languages = getLanguages(LANGUAGES);

                angular.forEach(keys, function (key, index) {
                    //console.log(key, languages[index]);
                    mapping[key + '-*'] = languages[index];
                });

                return mapping;
            }


            /**
             * Logging / compile configuration
             * https://docs.angularjs.org/api/ng/provider/$logProvider
             * https://docs.angularjs.org/api/ng/provider/$compileProvider
             *
             * Development: debugInfoEnabled(true)
             * Production: debugInfoEnabled(false)
             */
            $logProvider.debugEnabled(false);
            $compileProvider.debugInfoEnabled(false);


            /**
             * Ionic global configuration
             * http://ionicframework.com/docs/api/provider/$ionicConfigProvider/
             */
            $ionicConfigProvider.backButton.text('');
            $ionicConfigProvider.backButton.previousTitleText(false);
            $ionicConfigProvider.scrolling.jsScrolling(false);
            $ionicConfigProvider.views.transition('none');
            $ionicConfigProvider.views.forwardCache(true);


            /**
             * ApiService Configuration
             */
            ApiServiceProvider.setBaseApiUrl( (env.apiPort) ? env.apiHost + ':' + env.apiPort : env.apiHost );


            /**
             * WebSQL Configuration
             */
            //dbServiceProvider.prepare(DB_CONFIG);


            /**
             * Language Configuration
             */
            LanguageServiceProvider.setLanguages(LANGUAGES);


            /**
             * PouchDB Configuration
             */
            PouchDBServiceProvider.setLocalDB(env.couchDBName);
            PouchDBServiceProvider.setRemoteDB( (env.couchDBPort) ? env.couchDBHost + ':' + env.couchDBPort + '/' + env.couchDBName : env.couchDBHost + '/' + env.couchDBName );


            /**
             * Translate Configuration
             */
            $translateProvider.useStaticFilesLoader({
                prefix: 'assets/translations/',
                suffix: '.json'
            })
            .registerAvailableLanguageKeys(
                getLanguages(),
                getTranslateProviderMapping()
            )
            .uniformLanguageTag('bcp47')
            //.determinePreferredLanguage()
            .use(LANGUAGES.en)
            .fallbackLanguage(LANGUAGES.en)
            // Note: angular-translate sanitisation fails with UTF characters, use "sanitizeParameters" instead of "sanitize"
            .useSanitizeValueStrategy('sanitizeParameters');


            /**
             * i18n Configuration
             */
            tmhDynamicLocaleProvider.localeLocationPattern('assets/i18n/angular-locale_{{locale}}.js');
            tmhDynamicLocaleProvider.defaultLocale(LANGUAGES.en);


            /**
             * Resolve function for all states that requires authentication
             * @type {{auth: *[]}}
             */
            var requireAuth = {
                auth: ['AuthenticateService', function(AuthenticateService) {
                    return AuthenticateService.isAuthenticated();
                }]
            };


            /**
             * Application routing
             * Ionic uses AngularUI Router which uses the concept of states
             * Learn more here: https://github.com/angular-ui/ui-router
             * Set up the various states which the app can be in.
             * Each state's controller can be found in controllers
             */
            $stateProvider
                .state('app', {
                    url: '/app',
                    abstract: true,
                    templateUrl: 'templates/main.html',
                    controller: 'MainCtrl as vm'
                })
                .state('app.welcome', getState('welcome', '/welcome', true))
                .state('app.login', getState('login', '/login', true))
                .state('app.forgot-password', getState('forgot-password', '/forgot-password', true))
                .state('app.sign-up', getState('sign-up', '/sign-up', true))
                .state('app.trip', getState('trip', '/trip', true, requireAuth))
                .state('app.trip-detail', getState('trip-detail', '/trip-detail', true, requireAuth))
                .state('app.edit-profile', getState('edit-profile', '/edit-profile', true, requireAuth))
                .state('app.account-settings', getState('account-settings', '/account-settings', true, requireAuth))
                .state('app.product', getState('product', '/product', true, requireAuth))
                .state('app.story', getState('story', '/story', true, requireAuth))
                .state('app.icons', getState('icons', '/icons', true, requireAuth))
                .state('app.trips', getState('trips', '/trips', true, requireAuth))
                .state('app.wishlist', getState('wishlist', '/wishlist', true, requireAuth))
                .state('app.orders', getState('orders', '/orders', true, requireAuth))

                // The items below will be shown in side-menu
                .state('app.home', getState('home', '/home', true, requireAuth))
                //.state('app.inspired', getState('inspired', '/inspired', true, requireAuth))
                //.state('app.history', getState('history', '/history', true, requireAuth))
                .state('app.profile', getState('profile', '/profile', true, requireAuth))
                .state('app.qrcode', getState('qrcode', '/qrcode', true, requireAuth))
                .state('app.tax-refund', getState('tax-refund', '/tax-refund', true, requireAuth))
                .state('app.about', getState('about', '/about', true, requireAuth))
                .state('app.contact', getState('contact', '/contact', true, requireAuth))
                .state('app.settings', getState('settings', '/settings', true, requireAuth));

            $urlRouterProvider.otherwise('/app/welcome');
        });
    }
)();
