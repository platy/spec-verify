#!/usr/bin/env node_modules/.bin/babel-node --

import {load} from './assertion-loader';
import {run} from '../assertion-runner';
import TextCoverageHighlighter from '../coverage/text-highlighter.js'
import * as WebGet from '../fixture/node-web-get.js'
var fs = require('fs');
var fixtures = [WebGet];

Array.prototype.groupBy = function(equalityFn) {
    let groups = new Map();
    this.forEach(entry => {
        let entryKey = equalityFn(entry);
        var group = groups.get(entryKey);
        if(group)
            group.push(entry);
        else
            group = [entry];
        groups.set(entryKey, group);
    });
    return [...groups.values()]
};

var yargs = require('yargs')
    .usage('Usage: $0 <command> ...')
    .command('coverage', 'Check the spec coverage of an assertion file', function(yargs) {
        yargs
            .usage('Usage: $0 coverage <assertion file>')
            .demand(2, "Arguments required: coverage requires assertion file")
            .option('f', {
                alias: 'report-format',
                default: 'console',
                describe: 'output format of report {console/html}',
                type: 'string'
            })
            .help('help')
    })
    .command('verify', 'Run assertions against a fixture', function(yargs) {
        yargs
            .usage('Usage: $0 verify <assertion file> <fixture> [fixture args ...]')
            .demand(3, "Arguments required: verify requires assertion file and fixture to run verifications")
            .option('r', {
                alias: 'report-type',
                default: 'assertions',
                describe: 'report type for result of verification {assertions/failures/context}',
                type: 'string'
            })
            .help('help')
    })
    .help('help')
    .demand(1);
var argv = yargs
    .argv;

var printHighlightedSpec;
if (argv['report-format'] === 'html')
    printHighlightedSpec = require('./../coverage/html-markdown-highlight-renderer.js').printHighlightedSpec;
else
    printHighlightedSpec = require('./../coverage/console-text-highlight-renderer.js').printHighlightedSpec;

printHighlightedSpec.setTheme({
    passed: 'green',
    childFailure: 'yellow',
    selfFailure: 'red',
    covered: 'green'
});

var cmd = argv._[0];

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

            var result = TextCoverageHighlighter(allAssertions, spec.toString());
            printHighlightedSpec(result.marked);
            console.error(`${result.unmatched.length} Unmatched assertions out of ${allAssertions.length} : `);
            result.unmatched.forEach(ua => {
                console.error(ua.description);
            });
            console.error(`Coverage: ${result.coveragePercent} %`);
        })
    })
} else if (cmd === 'verify') {
    var fixtureName = argv._[2];
    var fixture = fixtures.find((f) => f.key === fixtureName);
    if (fixture) {
        fixture.load(argv._.slice(3), function (fixture) {
            let assertionsFile = argv._[1];
            load(assertionsFile, function (as, specFile) {
                var result = run(as, fixture);
                var reportType = argv['report-type'];
                if (reportType === 'assertions') {
                    result.root.forEach(result => printResult(result));
                    console.log(result.summary);
                } else if (reportType === 'failures') {
                    result.failingChildren.forEach(result => printResult(result));
                    console.log(result.summary);
                } else if (reportType === 'context') {
                    var results = result.flattenChildren.groupBy(r => r.description).map(rs => {
                        if (rs.find(r => r.selfFailure))
                            return {
                                description: rs[0].description,
                                highlight: 'selfFailure'
                            };
                        else if (rs.find(r => r.childFailure))
                            return {
                                description: rs[0].description,
                                highlight: 'childFailure'
                            };
                        else
                            return {
                                description: rs[0].description,
                                highlight: 'passed'
                            };
                    });
                    fs.readFile(specFile, (err, spec) => {
                        if (err) throw err;

                        var highlighting = TextCoverageHighlighter(results, spec.toString()).marked;
                        printHighlightedSpec(highlighting);
                        console.log(result.summary);
                    });
                } else {
                    console.error("unknown type : " + reportType);
                }
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