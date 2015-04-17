
class Assertion {
    constructor(description, body) {
        this.description = description;
        if(body) {
            this.body = body;
            this.parameters = functionParameters(body);
            this._isComplete = true;
        } else {
            this.hasCase = function(description, body) {
                var subAssertion = new Assertion(description, body);
                this.parameters = functionParameters(body);
                this.cases = this.cases || [];
                this.cases.push(subAssertion);
                return this;
            }
        }
    }
    toString() {
        return this.description;
    }
}


function functionParameters(body) {
    var str=body.toString();
    var len = str.indexOf("(");
    return str.substr(len+1,str.indexOf(")")-len -1).replace(/ /g,"").split(',')
}

export function contextGenerator() {
    var context = {
        rootAssertions: [],
        context: {
            assertion(description, body) {
                var a = new Assertion(description, body);
                context.rootAssertions.push(a);
                return a;
            },
            provide(argName, argValue) {

            },
            console: console,
            require: require
        }
    };
    return context;
}
