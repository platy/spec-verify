
class Assertion {
    constructor(description, bodies) {
        this.description = description;
        this.bodies = bodies;
    }
    hasCase(description) {
        this.cases = this.cases || [];
        this.cases.push(new Assertion(description, Array.prototype.slice.call(arguments, 1)));
        return this;
    }
    toString() {
        return this.description;
    }
}
module.exports = function () {
    var t = {
        rootAssertions: []
    };
    t.context = {
        assertion: function (description) {
            var a = new Assertion(description, Array.prototype.slice.call(arguments, 1));
            t.rootAssertions.push(a);
            return a;
        }
    };
    return t;
};
