/**
 * Created by danieldihardja on 10/06/16.
 */

(function() {
	'use strict';

    /**
     * @ngdoc function
     * @name Shopeur.serive:PreorderService
     * @description
     * # PreorderService handling the pre-order logic
     *
     * @param $q
     * @param ApiService
     * @param LocalStorageService
     * @param CameraService
     * @returns {{setProducts: setProducts, countProducts: countProducts, countPreorderCost: countPreorderCost, send: send}}
     * @constructor
     */
	function PreorderService($q, ApiService, LocalStorageService, CameraService) {

        /**
         * Trip product list
         * @type {Array}
         * @private
         */
		var _products = [];

        /**
         * User trip / order id after pre-order process
         */
		var _savedUserTripId;

		/**
		 * Set product by brand
		 * @param products
		 */
		function setProducts(products) {
			_products = [];
			for(var i = 0; i < products.length; i++) {
				var p = products[i];
				var productsFromBrand = p.products;
				for(var j = 0; j < productsFromBrand.length; j++) {
					_products.push(productsFromBrand[j]);
				}
			}
		}

        /**
         * Get product quantity
         * @returns {*|Function|o}
         */
		function countProducts() {
			return _products.length;
		}

        /**
         * Calculate pre-order costs
         * @returns {number}
         */
		function countPreorderCost() {
			return _products.length * 150;
		}

		/**
		 * Check if all the products of the trip
		 * and their images are written into the database
		 *
		 * @returns $q Promise
		 */
		function validatePreorder() {
			var productNameIds = [];
			_products.map(function(elem) {
				productNameIds.push(elem.id);
			});

			var params = {
				user_trip_id: _savedUserTripId,
				products: JSON.stringify(productNameIds)
			};

			// return ApiService.post('crud/api/user-trip/validate', params);
			return ApiService.get('epMde9/be79b3e5193bb1d05581258641dfd9290f44103f/files/snippet.json', params);
		}

        /**
         * Save the trip with product list
         * @param trip
         * @returns {*}
         */
        function saveTrip(trip) {

            var user = LocalStorageService.getItem('user');

            // Set the product check list
            var productsIdList = [];
            for(var i = 0; i < _products.length; i++) {
                productsIdList.push(_products[0].id);
            }

            var params = {
                user_id: 		user.id,
                status: 		trip.doc.status,
                destination_id: trip.doc.destination.value.id,
                start_date: 	trip.doc.startDate,
                end_date: 		trip.doc.endDate
            };

            //console.log('productsIdList', productsIdList);
            //console.log('productCheckList', productCheckList);
            //console.log('user', user);
            //console.log('trip', trip);
            //console.log('params', params);

						// return ApiService.post('crud/api/user-trip/create', params);
						return ApiService.get('rLpKRy/506803ad08c305df7b61c54d70580ed9769b8839/files/snippet.json');
        }

        /**
         * Upload product image
         * @param product
         * @returns {Function}
         */
        function saveProductImage(product) {
            return function() {
                var defer = $q.defer();
                var imgUri = product.doc.imageURI;

                CameraService.getImageDataURI(imgUri)
                    .then(function(data) {
                        var params = {
                            type: 'products',
                            imageData: data,
                            imageFileName: product.id + '-image.jpg'
                        };

												// ApiService.post('api/v1/image', params)
		                    ApiService.get('EArxRp/48fa31215afb5628c3f42955caa02f85862028cb/files/snippet.json')
                            .then(function() {
                                defer.resolve();
                            })
                            .catch(function(error) {
                                console.warn('ApiService image error => ', error);
                                defer.reject(error);
                            });
                    });

                return defer.promise;
            };
        }

        /**
         * Save product data
         * @param product
         * @returns {Function}
         */
        function saveProductData(product) {
            return function() {
                var params = {
                    user_trip_id: 	_savedUserTripId,
                    code: 			product.doc.productCode ? product.doc.productCode : null,
                    brand_id: 		product.doc.brand ? product.doc.brand.id : 1,
                    category_id: 	product.doc.category ? product.doc.category.doc.id : 1,
                    color_id: 		product.doc.color ? product.doc.color.id : 1,
                    size: 			product.doc.size ? product.doc.size : null,
                    image_file:	product.id + '-image.jpg',
                    name_id:		product.id
                };

								// return ApiService.post('crud/api/user-product/create', params);
								return ApiService.get('bRgX6d/49fa43074b6e548b6120b2cd1d53193f4c0c5eff/files/snippet.json', params);
            };
        }

        /**
         * Save products image / data
         * @param products
         * @returns {Promise}
         */
        function saveProducts(products) {
            var defer = $q.defer();
            var chain = $q.when();
            products.forEach(function (el) {
                chain = chain
                    .then(saveProductImage(el))
                    .then(saveProductData(el))
                    .catch(function(err) {
                        defer.reject(err);
                    });
            });
            return chain;
        }

		/**
		 * Send the pre order
		 * @param trip
		 * @returns {*}
		 */
		function send(trip) {
			var defer = $q.defer();
			saveTrip(trip)
				.then(function(response) {
                    console.info('*** Save trip products =>', response);

					// Store the id of the just created user trip
					_savedUserTripId = response.data.id;
                    return saveProducts(_products);
				})
				.then(function() {

					// serverside check if all the products and their images
					// are valid and the preorder status can be set to 1

					return validatePreorder();
				})
				.then(function(response) {
					if(response.data === false) {
						defer.reject();
					} else {
						console.info('**** Save trip products complete =>', response);
						defer.resolve(response);
					}
				})
				.catch(function(error) {
                    console.info('*** Save trip error =>', error);
				    defer.reject(error);
				});

			return defer.promise;
		}

		return {
			setProducts: setProducts,
			countProducts: countProducts,
			countPreorderCost: countPreorderCost,
			send: send
		};
	}

    PreorderService.$inject = [
        '$q',
        'ApiService',
        'LocalStorageService',
        'CameraService'
    ];

    angular.module('Shopeur')
        .factory('PreorderService', PreorderService);

})();
