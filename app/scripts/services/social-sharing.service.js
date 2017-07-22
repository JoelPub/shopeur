(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name Shopeur.SocialSharingService
     * @description
     * # SocialSharingService
     *
     * @returns {{share: share, shareVia: shareVia, canShareVia: canShareVia, shareWithOptions: shareWithOptions, shareViaWhatsApp: shareViaWhatsApp}}
     * @constructor
     */
    function SocialSharingService() {
        /**
         * Sharing success handler
         * "result.completed"   => On Android apps mostly return false even while it's true
         * "result.app"         => On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
         * @param result
         */
        function onSharingSuccess(result) {
            console.info('Share result => ', result);
        }

        /**
         * Sharing error handler
         * @param error
         */
        function onSharingError(error) {
            console.warn('Sharing failed => ', error);
        }

        /**
         * Default social sharing
         * share('Message only') => message only
         * share('Message and subject', 'The subject') => message and subject
         * share(null, null, null, 'http://www.x-services.nl') => link only
         * share('Message and link', null, null, 'http://www.x-services.nl') => message and link
         * share(null, null, 'https://www.google.nl/images/srpr/logo4w.png', null) => image only
         +
         * Beware: passing a base64 file as 'data:' is not supported on Android 2.x: https://code.google.com/p/android/issues/detail?id=7901#c43
         * Hint: when sharing a base64 encoded file on Android you can set the filename by passing it as the subject (second param)
         * share(null, 'Android filename', 'data:image/png;base64,R0lGODlhDAAMALMBAP8AAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAUKAAEALAAAAAAMAAwAQAQZMMhJK7iY4p3nlZ8XgmNlnibXdVqolmhcRQA7', null) => base64 image only
         *
         * Hint: you can share multiple files by using an array as thirds param: ['file 1','file 2', ..], but beware of this Android Kitkat Facebook issue: [#164]
         * share('Message and image', null, 'https://www.google.nl/images/srpr/logo4w.png', null) => message and image
         * share('Message, image and link', null, 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl') => message, image and link
         * share('Message, subject, image and link', 'The subject', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl') => message, subject, image and link
         *
         * @param message
         * @param subject
         * @param image
         * @param link
         */
        function share(message, subject, image, link) {
            window.plugins.socialsharing.share(message, subject, image, link, onSharingSuccess, onSharingError);
        }

        /**
         * Social sharing via
         * @param via
         * @param message
         * @param subject
         * @param files
         * @param url
         */
        function shareVia(via, message, subject, files, url) {
            window.plugins.socialsharing.shareVia(via, message, subject, files, url, onSharingSuccess, onSharingError);
        }

        /**
         * Social sharing can share via
         * @param via
         * @param message
         * @param subject
         * @param files
         * @param url
         */
        function canShareVia(via, message, subject, files, url) {
            window.plugins.socialsharing.canShareVia(via, message, subject, files, url, onSharingSuccess, onSharingError);
        }

        /**
         * Social sharing with option
         * "options" => this is the complete list of currently supported params you can pass to the plugin (all optional)
         * - message: not supported on some apps (Facebook, Instagram)
         * - subject: fi. for email
         * - files: an array of filenames either locally or remotely
         * - chooserTitle: Android only, you can override the default share sheet title
         *
         * var options = {
         *     message: 'share this',
         *     subject: 'the subject',
         *     files: ['', ''],
         *     url: 'https://www.website.com/foo/#bar?a=b',
         *     chooserTitle: 'Pick an app'
         * };
         *
         * @param options
         */
        function shareWithOptions(options) {
            window.plugins.socialsharing.shareWithOptions(options, onSharingSuccess, onSharingError);
        }

        /**
         * Social sharing via WhatsApp
         * @param message
         * @param image
         * @param url
         */
        function shareViaWhatsApp(message, image, url) {
            window.plugins.socialsharing.shareViaWhatsApp(message, image, url, onSharingSuccess, onSharingError);
        }

        return {
            share: share,
            shareVia: shareVia,
            canShareVia: canShareVia,
            shareWithOptions: shareWithOptions,
            shareViaWhatsApp: shareViaWhatsApp
        };
    }

    SocialSharingService.$inject = [];

    angular
        .module('Shopeur')
        .factory('SocialSharingService', SocialSharingService);
})();

