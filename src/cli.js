import {load} from './assertion-loader';
import {run} from './assertion-runner';
var colors = require('colors');

colors.setTheme({
    passed: 'green',
    childFailure: 'yellow',
    selfFailure: 'red'
});

load(process.argv[2], function (as) {
    //console.log(as.length + " root assertions");
    //as.forEach(function (a) {
    //    console.log('  ' + a.toString());
    //});
    //console.log("Total assertions");
    //as.forEach(function (r) {
    //    console.log('  ' + r.description);
    //    if (r.cases) r.cases.forEach(function (rcase) {
    //        console.log('    ' + rcase);
    //    })
    //});

    //var result = run(as, ['document', { data: [{type: "thing"}, {type: "thing"}], meta: {}, links: {} }]);
    var result = run(as, ['document', { data: {type: "thing"}, meta: {}, links: {} }]);
    result.root.forEach(result => printResult(result));
    console.log(result.summary);
});

function printFailure(failure, depth = 0) {
    var indent = '    '.repeat(depth);
    console.log(indent + `FAILURE: ${failure.description}`.red);
    if (failure.failureError)
        console.log(indent + `  ${failure.failureError}`.red);
    console.log(failure.failingChildren);
    if(failure.failingChildren)
        failure.failingChildren.forEach(child => {
            //console.log(child);
            console.log(Array.isArray(child));
            printFailure(child, depth + 1);
        });
}

function printResult(result, indent = '', indentedBullet = '') {
    function printBulleted(message) {
        console.log(indentedBullet + message.replace(/\r\n|\r|\n/g, '\n'+indent));
    }
    function print(message) {
        console.log(indent + message.replace(/\r\n|\r|\n/g, '\n'+indent));
    }
    var description = result.description.replace(/\r\n|\r|\n/g, '\n'+indent);
    if(result.passed)
        printBulleted(`PASSED: ${description}`.passed);
    else if(result.thisPassed)  // distinguishes that it passed but a decendent failed
        printBulleted(`FAILURE: ${description}`.childFailure);
    else
        console.log(indentedBullet + `FAILURE: ${description}`.selfFailure);
    if (!result.thisPassed && result.failureError)
        if(result.failureError.stack)
            print('  ' + result.failureError.stack.selfFailure);
        else
            print('  ' + result.failureError.selfFailure);
    if(result.caseResults) {
        result.caseResults.forEach((child, i) => {
            printResult(child, indent + '    ', indent + ` ${i+1}) `);
        });
    } else if(result.allChildren) // TODO : provided children should be grouped where the argument name and assertion are the same
        result.allChildren.forEach(child => {
            printResult(child, indent + '    ', indent + ' -- ');
        });
}