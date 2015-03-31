/*
Does node-side loading of assertion files
 */
var fs = require('fs'),
    vm = require('vm');
var AssertionContext = require('./assertion-context.js');


module.exports = function(filepath, callback) {
    var assertionContext = AssertionContext();
    var spectestApi = vm.createContext(assertionContext.context);

    fs.readFile(filepath, function (err, data) {
        if (err) throw err;
        vm.runInContext(data, spectestApi, {filename: filepath, showErrors: true});
        callback(assertionContext.rootAssertions);
    });
};
