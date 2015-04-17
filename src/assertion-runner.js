
class ResultNode {
    constructor(assertion, passed){
        this.assertion= assertion;
        this.passed = passed;
    }
    get description() {
        return this.assertion.description;
    }
}

function getParameterNames(func){
    var str=func.toString();
    var len = str.indexOf("(");
    return str.substr(len+1,str.indexOf(")")-len -1).replace(/ /g,"").split(',')
}

// Currently only a single initial entity is allowed, as otherwise an ordering would have to be provided
export function run(assertions, initialEntity) {
    if(Object.keys(initialEntity).length != 2)
        throw new Error(`Exactly one initial entity must be provided, ${Object.keys(initialEntity).length} provided`);

    function evaluate(stack) {
        var res = [];
        assertions.forEach(a => {
            var assertionRes = evaluateAssertion(a, stack);
            if (assertionRes)
                res.push(assertionRes);
        });
        return res;
    }

    function evaluateAssertion(a, stack) {
        var matchingBodies = a.bodies.filter(assertionBody => {
            var bpns = getParameterNames(assertionBody);
            return bpns[bpns.length - 1] === stack[stack.length - 1][0];
        });
        if (matchingBodies.length > 0) {
            var passed = evaluateBody(matchingBodies[0], stack);
            return new ResultNode(a, passed);
        }
    }

    function evaluateBody(body, stack) {
        console.log(`About to run ${body}`);
        try {
            body(stack[stack.length - 1][1]);
            return true;
        } catch(failureError) {
            return false;
        }
    }

    var stack = [initialEntity];

    return {root: evaluate(stack)};
}
