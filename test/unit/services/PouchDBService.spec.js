/**
 * Created by danieldihardja on 22/01/16.
 */

describe('PouchDBService', function() {

	var PouchDBService;
	var _localDB = 'db';
	var _remoteDB = 'http://remote.host.com:5984/db';

	beforeEach(function() {
		module('Shopeur');

		module(function(PouchDBServiceProvider) {
			PouchDBServiceProvider.setLocalDB(_localDB);
			PouchDBServiceProvider.setRemoteDB(_remoteDB);
		});

		inject(function($injector) {
			PouchDBService = $injector.get('PouchDBService');
		});
	});

	it('should be defined', function() {
		expect(PouchDBService).toBeDefined();
		expect(PouchDBService.localDB()).toEqual(_localDB);
		expect(PouchDBService.remoteDB()).toEqual(_remoteDB);
	});

});