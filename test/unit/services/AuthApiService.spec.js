/**
 * Created by danieldihardja on 14/01/16.
 */
describe('Service Authentincation', function() {

	var httpBackend;
	var AuthService;
	var ApiService;

	beforeEach(function() {
		module('Shopeur');
		inject(function($httpBackend, _AuthenticateService_, _ApiService_) {
			httpBackend = $httpBackend;
			AuthService = _AuthenticateService_;
			ApiService = _ApiService_;

			// mock the responce for ignoring translations and config.xml
			httpBackend.whenGET(/\.json$/).respond(200, '');
			httpBackend.whenGET(/\.xml$/).respond(200, '');
		});
	});

	it('should be defined', function() {
		expect(AuthService).toBeDefined();
	});



	describe('Login', function() {

		it('should be authenticated', function() {

			httpBackend.whenPOST( ApiService.baseApiUrl() + '/login').respond(200, {access_token: 'ABKSJ889JKL'} );


			var credentials = {
				username: 'username',
				password: 'password'
			};

			AuthService.authenticate(credentials)
				.then(function(res) {
					expect(AuthService.isAuthenticated()).toBe(true);
				});

			httpBackend.flush();
		});

		it('should not be authenticated', function() {

			httpBackend.whenPOST(ApiService.baseApiUrl() + '/login').respond(200, {success: false});

			var credentials = {
				username: 'username',
				password: 'password'
			};

			AuthService.authenticate(credentials)
				.then(function(res) {
					expect(AuthService.isAuthenticated()).toBe(false);
				});

			httpBackend.flush();
		});

	});
});