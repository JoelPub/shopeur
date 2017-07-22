describe('Service TeaserService', function() {

    var TeaserService;

    beforeEach(module('Shopeur'));

    beforeEach(inject(function(_TeaserService_) {
        TeaserService = _TeaserService_;
    }));

    it('should be defined', function() {
        expect(TeaserService).toBeDefined();
    });

    describe('"getAll()" teasers', function() {
        it('should contain a getAll() function', function() {
            expect(angular.isFunction(TeaserService.getAll)).toBe(true);
        });

        it('should return an array of teaser objects', function() {
            var teasers = TeaserService.getAll();
            expect(angular.isArray(teasers)).toBe(true);
            expect(teasers.length).toBeGreaterThan(0);

            teasers.forEach(function(teaser) {
                expect(isValidTeaser(teaser)).toBe(true);
            })
        });

        it('should return copies of the internal teasers array', function() {
            var teasers1 = TeaserService.getAll(),
                teasers2 = TeaserService.getAll();
            expect(teasers1).not.toBe(teasers2); // toBe -> ===
        });
    });

    describe('getById()', function() {
        it('should contain a getById() function', function() {
            expect(angular.isFunction(TeaserService.getById)).toBe(true);
        });

        it('should return the corresponding teaser object', function() {
            var id = 1;
            var teaser = TeaserService.getById(id);
            expect(isValidTeaser(teaser)).toBe(true);
            expect(teaser.id).toBe(id);
        });

        it('should return copies of the internal teaser objects', function() {
            var id = 2,
                teaser1 = TeaserService.getById(id),
                teaser2 = TeaserService.getById(id);
            expect(teaser1).not.toBe(teaser2); // toBe -> ===
            expect(teaser1).toEqual(teaser2);
        })
    });

    function isValidTeaser(teaser) {
        return angular.isDefined(teaser)
                && angular.isNumber(teaser.id)
                && angular.isString(teaser.text)
                && angular.isString(teaser.image);
    }

});