import {attachAssertionContextToGlobal} from '../assertion-context.js'
import TextCoverageHighlighter from '../coverage/text-highlighter.js'
import {highlightedSpec as highlightedMarkdownToHtml} from '../coverage/html-markdown-highlight-renderer.js'
require('should');

var SpecVerify = {};

SpecVerify.TextCoverageHighlighter = TextCoverageHighlighter;
SpecVerify.loadAssertionContext = attachAssertionContextToGlobal;

SpecVerify.flattenAssertions = function(as) {
    var allAssertions = [];
    as.forEach(rootAssertion => {
        allAssertions.push(rootAssertion);
        if(rootAssertion.cases)
            allAssertions.push(...rootAssertion.cases);
    });
    return allAssertions;
};

highlightedMarkdownToHtml.setTheme({
    passed: 'green',
    childFailure: 'yellow',
    selfFailure: 'red',
    covered: 'green'
});

SpecVerify.highlightedMarkdownToHtml = highlightedMarkdownToHtml;

global.SpecVerify = SpecVerify;
