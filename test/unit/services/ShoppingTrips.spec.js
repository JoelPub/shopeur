/**
 * Created by danieldihardja on 05/02/16.
 */
describe('Shopping Trips Service', function() {

	var PouchDBService;
	var $httpBackend;
	var ShoppingTripsService;
	var $browser;
	var $rootScope;

	beforeEach(function() {
		module('Shopeur');

		module(function(PouchDBServiceProvider) {
			PouchDBServiceProvider.setLocalDB("shopeur");
			PouchDBServiceProvider.setRemoteDB("http://127.0.0.1:5984/shopeur");
		});

		inject(function($injector) {
			$httpBackend = $injector.get('$httpBackend');
			ShoppingTripsService = $injector.get('ShoppingTripsService');
			PouchDBService = $injector.get('PouchDBService');
			$browser = $injector.get('$browser');
			$rootScope = $injector.get('$rootScope');

			// mock the responce for ignoring translations and config.xml
			$httpBackend.whenGET(/\.json$/).respond(200, '');
			$httpBackend.whenGET(/\.xml$/).respond(200, '');
		});
	});

	it('should be defined', function() {
		expect(ShoppingTripsService).toBeDefined();
		expect(PouchDBService).toBeDefined();
	});


	it('should return countries', function(done) {
		ShoppingTripsService.getCountries()
			.then(function(res){
				var rows = res.rows;
				for(var i=0; i<rows.length; i++) {
					var doc = rows[i].doc;
					//console.log(doc);
					expect(doc.type).toBe('Country');
				}
				done();
			});
	});

	it('should return cities by country id', function(done) {
		ShoppingTripsService.getCitiesByCountry('Country-1')
			.then(function(res) {
				for(var i=0; i<res.rows.length; i++) {
					var value = res.rows[i].value;
					//console.log(doc.value);
					expect(value.type).toBe('City');
					expect(value.countryId).toBe('Country-1');
				}
				done();
			});
	});

	it('should return shopping destinations by city', function(done) {
		ShoppingTripsService.getDestinationsByCity('City-1')
			.then(function(res) {
				for(var i=0; i<res.rows.length; i++) {
					var value = res.rows[i].value;
					expect(value.type).toBe('ShoppingDestination');
					expect(value.cityId).toBe('City-1');
					//console.log(value);
				}
				done();
			});
	});

	it('should return brands by shopping destination', function(done) {
		ShoppingTripsService.getBrandsByDestination('Destination-1')
			.then(function(res) {
				for(var i=0; i<res.rows.length; i++) {
					var value = res.rows[i].value;
					//console.log(value);
					expect(value.type).toBe('Brand');
				}
				done();
			});
	});


});