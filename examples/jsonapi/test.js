//import {load, run} from './../../es5/api.js';
var api = require('./../../es5/api.js');
var load = api.load, run = api.run;
require('should');


describe("JSONapi assertions", function(){
    var assertions = null;
    beforeEach(function(done) {
        load('./examples/jsonapi/assertions.js', function (as) {
            assertions = as;
            done();
        });
    });

    it("is valid for a basic document", function() {
        var result = run(assertions, ['document', {data:{type:''}}]);
        result.root.should.have.lengthOf(3);
        result.root[0].description.should.equal("A JSON object **MUST** be at the root of every JSON API response containing data.");
        result.root[0].passed.should.be.ok;
        result.root[2].description.should.equal("If any of these members appears in the top-level of a response, their values **MUST** comply with this specification.");
        result.root[2].passed.should.be.ok;
        result.passed.should.be.ok;
    });


    it("is not valid for an empty list", function() {
        var result = run(assertions, ['document', []]);
        result.root.should.have.lengthOf(3);
        result.root[0].description.should.equal("A JSON object **MUST** be at the root of every JSON API response containing data.");
        result.root[0].passed.should.not.be.ok;
        result.root[2].description.should.equal("If any of these members appears in the top-level of a response, their values **MUST** comply with this specification.");
        result.root[2].passed.should.be.ok;
        result.passed.should.not.be.ok;
    });
});
