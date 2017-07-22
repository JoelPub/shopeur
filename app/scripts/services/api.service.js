(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name Shopeur.ApiService
     * @description
     * # ApiService
     *
     * @returns {{
     *      setBaseApiUrl: Function,
     *      useBasicAuth: Function,
     *      setCredentials: Function,
     *      $get: *[]
     * }}
     *
     * @constructor
     */
    function ApiService() {

        var _username;
        var _password;
        var _baseApiUrl;
        var _useBasicAuth = false;

        return {

            setBaseApiUrl: function (url) {
                _baseApiUrl = url;
            },

            useBasicAuth: function (useBasicAuth) {
                _useBasicAuth = useBasicAuth;
            },

            setCredentials: function (username, password) {
                _username = username;
                _password = password;
            },

            $get: ['$http', '$q', '$window', 'LocalStorageService', function ($http, $q, $window, LocalStorageService) {

                if (_useBasicAuth) {
                    $http.defaults.headers.common.Authorization = 'Basic ' + $window.btoa(_username + ':' + _password);
                }

                return {

                    baseApiUrl: function () {
                        return _baseApiUrl;
                    },

                    post: function (endPoint, data, options) {

                        // for now use the admin token only
                        var accessToken = LocalStorageService.getItem('access_token');

                        var url = '';
                        if (options && options.sendToken === false) {
                            url = _baseApiUrl + '/' + endPoint;
                        } else {
                            url = _baseApiUrl + '/' + endPoint + '?access_token=' + accessToken;
                        }

                        var req = {
                            method: 'post',
                            url: url,
                            data: data
                        };

                        return $http(req);
                    },

                    get: function (endPoint, params) {
                        var req = {
                            method: 'get',
                            url: _baseApiUrl + '/' + endPoint,
                            params: params
                        };

                        return $http(req);
                    }
                };
            }]
        };
    }

    angular
        .module('Shopeur')
        .provider('ApiService', ApiService);
})();
