/*
Does node-side loading of assertion files
 */
var fs = require('fs'),
    vm = require('vm'),
    url = require('url');
import {contextGenerator} from '../assertion-context';


export function load(filepath, callback) {
    console.error("Loading: ", filepath);
    var assertionContext = contextGenerator();
    var spectestApi = vm.createContext(assertionContext.context);

    fs.readFile(filepath, (err, data) => {
        if (err) throw err;
        vm.runInContext("require('should');" + data, spectestApi, {filename: filepath, showErrors: true});
        var specPath = url.resolve(filepath, assertionContext.context.spec);
        callback(assertionContext.rootAssertions, specPath);
    });
}