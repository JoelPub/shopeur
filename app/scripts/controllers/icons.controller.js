(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.controller:IconsCtrl
     * @description
     * # IconsCtrl
     *
     * @constructor
     */
    function IconsCtrl() {
        this.icons = [
            'icon-shopeur-arrow-left',
            'icon-shopeur-arrow-open',
            'icon-shopeur-arrow-right',
            'icon-shopeur-camera',
            'icon-shopeur-close',
            'icon-shopeur-edit-product',
            'icon-shopeur-edit-settings',
            'icon-shopeur-icons-user',
            'icon-shopeur-like-feature',
            'icon-shopeur-location',
            'icon-shopeur-locked',
            'icon-shopeur-mail',
            'icon-shopeur-menue',
            'icon-shopeur-move-product-to-list',
            'icon-shopeur-new-product',
            'icon-shopeur-not-available',
            'icon-shopeur-plane',
            'icon-shopeur-please-check',
            'icon-shopeur-preorder-product',
            'icon-shopeur-preordered-status',
            'icon-shopeur-qr-code',
            'icon-shopeur-received',
            'icon-shopeur-show-info',
            'icon-shopeur-star',
            'icon-shopeur-store-info',
            'icon-shopeur-unlocked',
            'icon-shopeur-waiting-for-response',
            'icon-shopeur-wechat'
        ];
    }

    IconsCtrl.$inject = [];

    angular.module('Shopeur')
        .controller('IconsCtrl', IconsCtrl);

})();