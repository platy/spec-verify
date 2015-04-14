import {load, run} from './../../api.js';
require('should');


describe("JSONapi assertions", function(){
    var assertions = null;
    beforeEach(function(done) {
        load('./examples/jsonapi/assertions.js', function (as) {
                assertions = as;
                done();
            });
    });

    it("is valid for an empty object", function() {
        var result = run(assertions, ['document', {}]);
        result.root.should.have.lengthOf(2);
        var assertion1result = result.root[0];
        assertion1result.description.should.equal("A JSON object **MUST** be at the root of every JSON API response containing data.");
        assertion1result.passed.should.be.ok();
    });


    it("is not valid for an empty list", function() {
        var result = run(assertions, ['document', []]);
        result.root.should.have.lengthOf(2);
        var assertion1result = result.root[0];
        assertion1result.description.should.equal("A JSON object **MUST** be at the root of every JSON API response containing data.");
        assertion1result.passed.should.not.be.ok();
    });
});
