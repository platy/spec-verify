/*
If running assertions in the browser, you would first include the browserified version of this script and then the assertions
 */
var assertionContext = require('./assertion-context.js')();

rootAssertions = assertionContext.rootAssertions;
// TODO add all members of context to the window
assertion = assertionContext.context.assertion;