// TODO: allow providing multiple initial entities
// TODO: match multiple elements of the stack for bodies with multiple parameters
// TODO: report coverage of assertion statements for a run

class SuccessResultNode {
    constructor(assertion, providedChildResults){
        this.assertion= assertion;
        this.thisPassed = true;
        this.providedChildResults = providedChildResults;
    }
    get description() {
        return this.assertion.description;
    }
    get passingChildren() {
        return this.providedChildResults.map(child => {
            return child.results.filter(child => {
                return child.passed
            })
        });
    }
    get failingChildren() {
        return Array.prototype.concat.apply([], this.providedChildResults.map(child => {
            return child.results.filter(child => {
                return !child.passed
            });
        }));
    }
    get allChildren() {
        return Array.prototype.concat.apply([], this.providedChildResults.map(child => {
            return child.results;
        }));
    }
    get passed() {
        return this.thisPassed && this.failingChildren.length === 0;
    }
    get failureError() {
        return `${this.passingChildren.length}/${this.providedChildResults.length} children passed, should be all.`
    }
    toString() {
        return `SuccessResultNode with ${this.passingChildren.length}/${this.providedChildResults.length} children passed\n${this.description}`
    }
}

class FailureResultNode {
    constructor(assertion, failureError){
        this.assertion= assertion;
        this.thisPassed = false;
        this.passed = false;
        this.failureError = failureError;
    }
    get description() {
        return this.assertion.description;
    }
}

class CaseResultNode {
    constructor(assertion, caseResults){
        this.assertion= assertion;
        this.caseResults = caseResults;
    }
    get description() {
        return this.assertion.description;
    }
    get passingChildren() {
        return this.caseResults.filter(child => child.passed);
    }
    get failingChildren() {
        return this.caseResults.filter(child => !child.passed);
    }
    get allChildren() {
        return this.caseResults;
    }
    get thisPassed() {
        return this.passed;
    }
    get passed() {
        return this.passingChildren.length === 1;
    }
    get failureError() {
        return `${this.passingChildren.length}/${this.caseResults.length} cases passed, should be one.`
    }
}

class ResultRoot {
    constructor(rootNodes){
        this.root = rootNodes;
    }
    get description() {
        return "Result root";
    }
    get passed() {
        return this.root.every((child) => child.passed);
    }
    get passingChildren() {
        return this.root.filter(child => child.passed);
    }
    get failingChildren() {
        return this.root.filter(child => !child.passed);
    }
    get allChildren() {
        return this.root;
    }
    get summary() {
        if(this.passed)
            return `${this.passingChildren.length} assertions passed`;
        else {
            return `${this.passingChildren.length} assertions passed, but ${this.failingChildren.length} failed`;
        }
    }
}

// Stack of test-entities
class Stack {
    constructor(stack, argumentName, argumentValue) {
        this.head = [argumentName, argumentValue];
        this.tail = stack;
    }
    cons(argumentName, argumentValue) {
        return new Stack(this, argumentName, argumentValue);
    }
}

// Currently only a single initial entity is allowed, as otherwise an ordering would have to be provided
export function run(assertions, initialEntity) {
    if(Object.keys(initialEntity).length != 2)
        throw new Error(`Exactly one initial entity must be provided, ${Object.keys(initialEntity).length} provided`);

    function evaluate(stack) {
        var res = [];
        assertions.forEach(a => {
            var assertionRes = evaluateAssertionForStack(a, stack);
            if (assertionRes)
                res.push(assertionRes);
        });
        return res;
    }

    function evaluateAssertionForStack(a, stack) {
        var bpns = a.parameters;
        var topOfStack = stack.head;
        if (bpns[bpns.length - 1] === topOfStack[0]) {
            return evaluateAssertionForArguments(a, [topOfStack[1]])
        }

        function evaluateAssertionForArguments(a, args) {
            if (a.body) {
                return evaluateBody(a, args);
            } else { // case assertion
                var caseResults = a.cases.map(assertionCase => {
                    return evaluateAssertionForArguments(assertionCase, args)
                });
                return new CaseResultNode(a, caseResults)
            }
        }

        function evaluateBody(a, args) {
            //console.log(`About to run ${a.body} with ${args}`);
            try {
                var providedChildren = [];
                var bodyThis = {
                    provides(argName, argValue) {
                        var results = evaluate(stack.cons(argName, argValue));
                        providedChildren.push({argName, argValue, results});
                    },
                    providesAtLeastOne(...args) {
                        var optionalProvisions = args.map(([argName, argValue]) => {
                            var results = evaluate(stack.cons(argName, argValue));
                            return {argName, argValue, results};
                        });
                        var passedPredicate = provision => {
                            return provision.results.every(provision => {
                                return provision.passed; })
                        };
                        if(optionalProvisions.some(passedPredicate))
                            providedChildren.push(...optionalProvisions.filter(passedPredicate));
                        else
                            providedChildren.push(...optionalProvisions);
                    }
                };
                a.body.apply(bodyThis, args);
                return new SuccessResultNode(a, providedChildren);
            } catch(failureError) {
                return new FailureResultNode(a, failureError);
            }
        }
    }

    var [initialEntityName, initialEntityValue] = initialEntity;
    var stack = new Stack(undefined, initialEntityName, initialEntityValue);

    return new ResultRoot(evaluate(stack));
}
