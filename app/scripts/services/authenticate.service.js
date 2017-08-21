(function () {

    'use strict';

    /**
     * @ngdoc service
     * @name Shopeur.AuthenticateService
     * @description
     * # AuthenticateService
     *
     * @param $rootScope
     * @param $q
     * @param ApiService
     * @param LocalStorageService
     * @returns {{isAuthenticated: isAuthenticated, authenticate: authenticate, keepLoggedIn: keepLoggedIn, logout: logout}}
     * @constructor
     */
    function AuthenticateService($rootScope, $q, ApiService, LocalStorageService) {

        /**
         * User is authenticated
         * @type {boolean}
         * @private
         */
        var _isAuthenticated = false;

        /**
         * User keep logged in setting
         * @type {boolean}
         * @private
         */
        var _keepLoggedIn = true;

        /**
         * Is user authenticated
         * @returns {boolean}
         */
        function isAuthenticated() {
            return $q(function (resolve, reject) {
                var token = LocalStorageService.getItem('access_token');
                if (!token) {
                    reject();
                } else {
                    resolve();
                }
            });
        }

        /**
         * Set keep user logged in setting
         * @param bool
         * @returns {*}
         */
        function keepLoggedIn(bool) {
            if (bool === undefined) {
                _keepLoggedIn = LocalStorageService.getItem('settings.keepLoggedId');
                if (_keepLoggedIn === null) {
                    return false;
                }
                return _keepLoggedIn;
            } else {
                _keepLoggedIn = bool;
                LocalStorageService.setItem('settings.keepLoggedId', _keepLoggedIn);
                return _keepLoggedIn;
            }
        }

        /**
         * Reset the access token and set the _isAuthenticated to false
         */
        function logout() {
            _isAuthenticated = false;
            LocalStorageService.setItem('access_token', null);
            LocalStorageService.setItem('user', null);
            LocalStorageService.setItem('profile', null);
        }

        /**
         * Set is authenticated
         * @param credentials
         * @returns {*}
         */
        function authenticate(credentials) {
            var deferred = $q.defer();

            var _serverResponse;

            // ApiService.post('api/v1/login', credentials, {sendToken: false})
            ApiService.get('gM5XMd/c7cb4af3b65465704b6e62652389e16222ff38b6/files/snippet.json', credentials, {sendToken: false})
                .then(function (response) {
                    console.info('Login success => ', response);
                    _serverResponse = response;

                    // login success
                    if (response.data.user) {

                        var user = response.data.user;
                        var profile = response.data.profile;
                        _isAuthenticated = true;

                        LocalStorageService.setItem('remote_file_path', response.data.remote_file_path);
                        LocalStorageService.setItem('access_token', response.data.access_token);
                        LocalStorageService.setItem('user', user);
                        LocalStorageService.setItem('profile', profile);

                        $rootScope.$broadcast('authenticateServiceEvent', true);

                        deferred.resolve();
                    }
                    else {
                        _isAuthenticated = false;
                        $rootScope.$broadcast('authenticateServiceEvent', false);
                        deferred.reject(response);
                    }
                })
                .catch(function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        return {
            isAuthenticated: isAuthenticated,
            authenticate: authenticate,
            keepLoggedIn: keepLoggedIn,
            logout: logout
        };
    }

    AuthenticateService.$inject = [
        '$rootScope',
        '$q',
        'ApiService',
        'LocalStorageService'
    ];

    angular
        .module('Shopeur')
        .factory('AuthenticateService', AuthenticateService);
})();
