var fs = require('fs'),
    vm = require('vm');

function Assertion(description, bodies) {
    this.description = description;
    this.bodies = bodies;
}

Assertion.prototype.case = function(description) {
    this.cases = this.cases || [];
    this.cases.push(new Assertion(description, Array.prototype.slice.call(arguments, 1)));
    return this;
};

Assertion.prototype.toString = function() {
    return this.description;
};

module.exports = function(filepath, callback) {
    var rootAssertions = [];
    var spectestApi = vm.createContext({
        assertion: function (description) {
            var a = new Assertion(description, Array.prototype.slice.call(arguments, 1));
            rootAssertions.push(a);
            return a;
        }
    });

    fs.readFile(filepath, function (err, data) {
        if (err) throw err;
        vm.runInContext(data, spectestApi);
        callback(rootAssertions);
    });
};
