var should = require("should");

var CoverageChecker = require('../../es5/coverage/text-highlighter.js');

describe('Coverage of no assertions', function(){
    var spec = "hello world!";
    var result = CoverageChecker([], spec);
    it('should have no markers', function(){
        result.should.have.property('markers').which.is.empty;
    });
    it('should total to 0%', function(){
        result.should.have.property('coveragePercent', 0);
    });
    it('should have an unmatched marked document', function(){
        result.should.have.property('marked').with.property(0).with.properties({
            "highlight": false,
            'text': spec});
    })
});

describe('Coverage of 1 assertion', function(){
    var assertion = {description: "hello"};
    var result = CoverageChecker([assertion], "helloworld");
    it('should have 1 marker', function(){
        result.should.have.property('markers').with.lengthOf(1);
        var markers = result.markers[0];
        markers.should.have.property('assertion', assertion);
        markers.should.have.lengthOf(1)
    });
    it('should have 5 chars covered', function(){
        result.should.have.property('coverageChars', 5);
    });
    it('should total to 50%', function(){
        result.should.have.property('coveragePercent', 50);
    });
    it('should have the assertion marked', function(){
        result.should.have.property('marked');
        var marked = result.marked;
        marked.should.have.property(0).with.properties({
            highlight: "covered",
            'text': 'hello'
        });
        marked.should.have.property(1).with.properties({
            highlight: false,
            text: 'world'
        });
    });
});

describe("Coverage of 2 overlapping assertions", function(){
    var assertion1 = {description: "foo"};
    var assertion2 = {description: "foo bar"};
    var result = CoverageChecker([assertion1, assertion2], "foo bar baz");
    it('should have 2 markers', function(){
        result.should.have.property('markers').with.lengthOf(2);
        var markers1 = result.markers[0];
        markers1.should.have.property('assertion', assertion1);
        markers1.should.have.lengthOf(1);
        var markers2 = result.markers[1];
        markers2.should.have.property('assertion', assertion2);
        markers2.should.have.lengthOf(1);
    });
    it('should have 7 chars covered', function(){
        result.should.have.property('coverageChars', 7);
    });
});

describe('Coverage of an assertion which appears twice', function(){
    var assertion = {description: "hello"};
    var result = CoverageChecker([assertion], "hello hello");
    it('should have 2 marker', function(){
        result.should.have.property('markers').with.lengthOf(1);
        var markers = result.markers[0];
        markers.should.have.property('assertion', assertion);
        markers.should.have.lengthOf(2)
    });
    it('should have 5 chars covered', function(){
        result.should.have.property('coverageChars', 10);
    });
});

describe('Coverage of unmatched assertion', function(){
    var assertion = {description: "baz"};
    var result = CoverageChecker([assertion], "hello world!");
    it('should have no markers', function(){
        result.should.have.property('markers').with.lengthOf(1);
        result.markers[0].should.be.empty;
    });
    it('should total to 0%', function(){
        result.should.have.property('coveragePercent', 0);
    });
    it('should have unmatched assertions', function() {
        result.should.have.property('unmatched').which.containEql(assertion);
    })
});

describe('Coverage of assertion with incorrect whitespace', function(){
    var assertion = {description: "foo bar"};
    var result = CoverageChecker([assertion], "foo\n\n\t  bar baz");
    it('should match', function(){
        result.should.have.property('markers').with.lengthOf(1);
        var markers = result.markers[0];
        markers.should.have.property('assertion', assertion);
        markers.should.have.lengthOf(1)
    });
    it('should have the number of chars form the spec covered', function(){
        result.should.have.property('coverageChars', 11);
    });
});
