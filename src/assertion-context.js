
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

export function contextGenerator() {
    var context = {
        rootAssertions: [],
        context: {
            assertion(description) {
                var a = new Assertion(description, Array.prototype.slice.call(arguments, 1));
                context.rootAssertions.push(a);
                return a;
            },
            console: console,
            require: require
        }
    };
    return context;
}
