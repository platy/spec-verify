#!/usr/bin/env node_modules/.bin/babel-node --stage 0 --

import {load} from './assertion-loader';
import {run} from './assertion-runner';
import TextCoverageChecker from './coverage/text-coverage.js'
import * as WebGet from './fixture/web-get.js'
var colors = require('colors');
var fs = require('fs');
var fixtures = [WebGet];

colors.setTheme({
    passed: 'green',
    childFailure: 'yellow',
    selfFailure: 'red',
    covered: 'green'
});

var yargs = require('yargs')
    .usage('Usage: $0 <command> ...')
    .command('coverage', 'Check the spec coverage of an assertion file', function(yargs) {
        yargs
            .usage('Usage: $0 coverage <assertion file>')
            .demand(2, "Assertion file required to check coverage")
            .help('help')
    })
    .command('verify', 'Run assertions against a fixture', function(yargs) {
        yargs
            .usage('Usage: $0 verify <assertion file> <fixture> [fixture args ...]')
            .demand(3)
            .help('help')
    })
    .help('help')
    .demand(1);
var argv = yargs
    .argv;

var cmd = argv._[0];

function printCoverageMarkedSpec(markedDoc) {
    var spec = '';
    for(var i in markedDoc) {
        var part = markedDoc[i];
        console.log(part);
        if(part.covered)
            spec = spec + part.text.covered;
        else
            spec = spec + part.text;
    }
    console.log(spec);
}

if(cmd === 'coverage'){
    let assertionsFile = argv._[1];
    load(assertionsFile, function (as, specFile) {
        fs.readFile(specFile, (err, spec) => {
            if (err) throw err;

            var allAssertions = [];
            as.forEach(rootAssertion => {
                allAssertions.push(rootAssertion);
                if(rootAssertion.cases)
                    allAssertions.push(...rootAssertion.cases);
            });

            var result = TextCoverageChecker(allAssertions, spec.toString());
            printCoverageMarkedSpec(result.marked);
            console.log(`${result.unmatched.length} Unmatched assertions out of ${allAssertions.length} : `);
            result.unmatched.forEach(ua => {
                console.log(ua.description);
            });
            console.log(`Coverage: ${result.coveragePercent} %`);
        })
    })
} else if (cmd === 'verify') {
    var fixtureName = argv._[2];
    var fixture = fixtures.find((f) => f.key === fixtureName);
    if (fixture) {
        fixture.load(argv._.slice(3), function (fixture) {
            let assertionsFile = argv._[1];
            load(assertionsFile, function (as) {
                var result = run(as, fixture);
                result.root.forEach(result => printResult(result));
                console.log(result.summary);
            });
        });
    } else {
        console.log(`Unknown fixture ${fixtureName}`)
    }
} else {
    console.log(`Unknown command ${cmd}
    ${yargs.help()}`);
}

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
    } else if(result.allChildren) // TODO : provided children should be grouped where the argument name and assertion are the same & provided names should be shown
        result.allChildren.forEach(child => {
            printResult(child, indent + '    ', indent + ' -- ');
        });
}