/**
 * Created by danieldihardja on 21/01/16.
 */
describe('Signup Service', function() {

	var fakehost = 'http://fakehost.com';
	var ApiService;
	var SignupService;
	var $httpBackend;

	beforeEach(function() {
		module('Shopeur');
		module(function(ApiServiceProvider) {
			ApiServiceProvider.setBaseApiUrl(fakehost);
		});

		inject(function($injector) {
			ApiService = $injector.get('ApiService');
			SignupService = $injector.get('SignupService');
			$httpBackend = $injector.get('$httpBackend');

			// mock the responce for ignoring translations and config.xml
			$httpBackend.whenGET(/\.json$/).respond(200, '');
			$httpBackend.whenGET(/\.xml$/).respond(200, '');
		});
	});

	it('should be defined', function() {
		expect(ApiService).toBeDefined();
		expect(SignupService).toBeDefined();
		expect($httpBackend).toBeDefined();
	});

	it('shoud sign up', function(){
		$httpBackend.whenPOST(ApiService.baseApiUrl() + '/register').respond(200, {success: true});

		var user = {
			forename: 'John',
			surname: 'smith',
			email: 'john@smith.com',
			password: 'secretjohn'
		};

		SignupService.register(user)
			.then(function(res) {
				expect(res.data.success).toBe(true);
			})
			.catch(function(err) {
			    throw err
			});

		$httpBackend.flush();

	});
});