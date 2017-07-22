(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name Shopeur.ProfileService
     * @description
     * # ProfileService
     *
     * @param $q
     * @param $filter
     * @param $translate
     * @param PouchDBService
     * @param LocalStorageService
     * @param CameraService
     * @param ApiService
     * @returns {{getProfile: getProfile, getUsername: getUsername, getForename: getForename, getSurname: getSurname, getLocaleName: getLocaleName, saveProfile: saveProfile, getColors: getColors, getMessage: getMessage}}
     * @constructor
     */
    function ProfileService($q, $filter, $translate, PouchDBService, LocalStorageService, CameraService, ApiService) {

        /**
         * User profile data
         * @type {{
         *      id: int,
         *      username: string,
         *      email: *,
         *      password_hash: *,
         *      auth_key: *,
         *      confirmed_at: date,
         *      unconfirmed_email: string,
         *      blocked_at: date,
         *      registration_ip: string,
         *      created_at: date,
         *      updated_at: date,
         *      flags: string,
         *      forename: string,
         *      surname: string,
         *      date_of_birth: date,
         *      gender: string,
         *      body_height: int,
         *      weight: int,
         *      chest: int,
         *      waist: int,
         *      hips: int,
         *      shoe_size: int,
         *      colors: json string,
         *      image: string
         * }}
         * @private
         */
        var _profile = {};

        /**
         * Parse json color string, set selected and return colors
         * @param colors
         * @param colorObjects
         * @returns {Array}
         */
        function setSelectedColors(colors, colorObjects) {

            var selectedColorIds = JSON.parse(colors);

            for(var i = 0; i < colorObjects.length; i++) {
                var color = colorObjects[i];
                for(var j = 0; j < selectedColorIds.length; j++) {
                    var colorId = selectedColorIds[j];
                    if(colorId === color.id){
                        color.checked = true;
                    }
                }
            }

            return colorObjects;
        }

        /**
         * Is selected color
         * @param id
         * @returns {boolean}
         */
        function isChecked(id) {

            if(!_profile) {
                return false;
            }

            return (angular.isArray(_profile.colors) && _profile.colors.indexOf(id) !== -1);
        }

        /**
         *
         * @param res
         * @returns {Array}
         */
        function flatten(res) {
            var list = [];
            var rows = res.rows;
            for (var i = 0; i < rows.length; i++) {
                rows[i].doc.checked = isChecked(rows[i].doc.id);
                list.push(rows[i].doc);
            }
            return list;
        }

        /**
         * Get colors from couch
         * @returns {*}
         */
        function getColors() {
            var defer = $q.defer();

            var opt = {
                include_docs: true,
                startkey: 'Color-',
                endkey: 'Color-\uffff'
            };

            PouchDBService.allDocs(opt)
                .then(function (res) {
                    defer.resolve(flatten(res));
                });

            return defer.promise;
        }

        /**
         * Returns the profile with image and colors
         * @returns {*}
         */
        function getProfile() {

            var defer = $q.defer();

            getColors()
                .then(function(response) {

                    var _image = null;
                    var _colors = response;

                    _profile = LocalStorageService.getItem('profile');

                    if(_profile) {

                        if(_profile.colors) {
                            _colors = setSelectedColors(_profile.colors, _colors);
                        }

                        if(_profile.date_of_birth) {
                            _profile.date_of_birth = new Date(_profile.date_of_birth);
                        }

                        if(_profile.image) {
                            CameraService.getImageUrl(_profile.image)
                                .then(function(response) {
                                    _image = response.image;
                                    defer.resolve({profile: _profile, image: _image, colors: _colors});
                                })
                                .catch(function(error) {
                                    // Local file not found, set fallback image
                                    _image = error.image;
                                    defer.resolve({profile: _profile, image: _image, colors: _colors});
                                });
                        } else {
                            // No local file, set fallback image
                            _image = CameraService.getFallbackImage();
                            defer.resolve({profile: _profile, image: _image, colors: _colors});
                        }
                    }
                });

            return defer.promise;
        }

        /**
         * Get username
         * @returns {*}
         */
        function getUsername() {
            return _profile.username;
        }

        /**
         * Get forename
         * @returns {*}
         */
        function getForename() {
            return _profile.forename;
        }

        /**
         * Get surname
         * @returns {*}
         */
        function getSurname() {
            return _profile.surname;
        }

        /**
         * Get forename and surname by locale when set, otherwise get username
         * @returns {*}
         */
        function getLocaleName() {

            if(!_profile) {
                return;
            }

            if(!_profile.forename && !_profile.surname) {
                return _profile.username;
            }

            if($translate.use() === 'zh-CN') {
                return _profile.surname + ' ' + _profile.forename;
            } else {
                return _profile.forename + ' ' + _profile.surname;
            }
        }

        /**
         * Callback fn for color mapping, get color id from "profile.colors" object
         * @param color
         * @returns {*}
         */
        function getColorId(color) {
            return color.id;
        }

        /**
         * Save profile
         * @param profile
         */
        function saveProfile(profile) {
            console.info('* Save profile =>', profile);

            // Add a check sum in order to check if the online profile is still sync with
            // the local profile. if not, then update the online profile
            profile.checksum = chance.hash({length: 16, casing: 'upper'});

            // Check if an image was selected. if not, use the default avatar
            if(!profile.imageURI) {
                profile.imageURI = 'assets/images/avatar.jpg';
            }

            profile.colors = JSON.stringify(profile.colors.map(getColorId));

            _profile = profile;

            var user = LocalStorageService.getItem('user');
            var imageFileName = 'user-' + user.id + '-image.jpg';

            // Save the profile on the device
            LocalStorageService.setItem('profile', profile);

            var params = {
                id:             user.id,
                name:           profile.forename + ' ' + profile.surname,
                public_email:   '',
                gravatar_email: '',
                gravatar_id:    '',
                location:       '',
                website:        '',
                bio:            '',
                forename:       profile.forename,
                surname:        profile.surname,
                date_of_birth:  $filter('date')(profile.date_of_birth, 'MM/dd/yyyy'),
                gender:         profile.gender,
                body_height:    profile.body_height,
                weight:         profile.weight,
                chest:          profile.chest,
                waist:          profile.waist,
                hips:           profile.hips,
                shoe_size:      profile.shoe_size,
                colors:         profile.colors,
                image:          imageFileName,
                checksum:       profile.checksum
            };

            var defer = $q.defer();

            ApiService.post('api/v1/update-profile', params)
                .then(function() {
                    return CameraService.getImageDataURI(profile.imageURI);
                })
                .then(function(base64Data) {
                    var params = {
                        type: 'profiles',
                        imageData: base64Data,
                        imageFileName: imageFileName
                    };
                    return ApiService.post('api/v1/image', params);
                })
                .then(function() {
                    console.info('** Saved profile successfully...');
                    defer.resolve();
                })
                .catch(function(error) {
                    console.warn('** Save profile error =>', error);
                    defer.reject(error);
                });

            return defer.promise;
        }

        /**
         * Get message by hour
         * Testing => new Date('2012/11/06 10:10').getHours()
         * @returns {string}
         */
        function getMessage() {
            var hour = new Date().getHours();
            var msg = '';

            switch (true) {
                case hour < 12:
                    msg = $translate.instant('home.morning');
                    break;
                case hour < 18:
                    msg = $translate.instant('home.afternoon');
                    break;
                default:
                    msg = $translate.instant('home.evening');
                    break;
            }

            return msg;
        }

        return {
            getProfile: getProfile,
            getUsername: getUsername,
            getForename: getForename,
            getSurname: getSurname,
            getLocaleName: getLocaleName,
            saveProfile: saveProfile,
            getColors: getColors,
            getMessage: getMessage
        };
    }

    ProfileService.$inject = [
        '$q',
        '$filter',
        '$translate',
        'PouchDBService',
        'LocalStorageService',
        'CameraService',
        'ApiService'
    ];

    angular.module('Shopeur')
        .factory('ProfileService', ProfileService);

})();
