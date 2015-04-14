import {load} from './../../assertion-loader';


describe("JSONapi assertions", function(){
    var assertions = null;
    beforeEach(function(done) {
        load('./examples/jsonapi/assertions.js', function (as) {
                assertions = as;
                done();
            });
    });

    it("is valid for an empty object", function() {
        console.log(assertions);
    });
});
