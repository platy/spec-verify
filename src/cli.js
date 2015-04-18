import {load} from './assertion-loader';
import {run} from './assertion-runner';
var colors = require('colors');

load(process.argv[2], function (as) {
    console.log(as.length + " root assertions");
    as.forEach(function (a) {
        console.log('  ' + a.toString());
    });
    console.log("Total assertions");
    as.forEach(function (r) {
        console.log('  ' + r.description);
        if (r.cases) r.cases.forEach(function (rcase) {
            console.log('    ' + rcase);
        })
    });

    var result = run(as, ['document', { data: {}, meta: {}, links: {} }]);
    //var result = run(as, ['primaryData', [{type: "thing"}]]);   // TODO need a result printer to see why this is failing, it is probably something missing in the results tree
    //var result = run(as, ['resourceObject', {type: "thing"}]);
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
    var description = result.description.replace(/\r\n|\r|\n/g, '\n'+indent);
    if(result.passed)
        console.log(indentedBullet + `PASSED: ${description}`.green);
    else if(result.thisPassed)  // distinguishes that it passed but a decendent failed
        console.log(indentedBullet + `FAILURE: ${description}`.yellow);
    else
        console.log(indentedBullet + `FAILURE: ${description}`.red);
    if (!result.thisPassed && result.failureError)
        console.log(indent + `  ${result.failureError}`.red);
    if(result.caseResults) {
        result.caseResults.forEach((child, i) => {
            printResult(child, indent + '    ', indent + ` ${i+1}) `);
        });
    } else if(result.allChildren)
        result.allChildren.forEach(child => {
            printResult(child, indent + '    ', indent + ' -- ');
        });
}