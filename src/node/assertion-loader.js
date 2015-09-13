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
        try {
            vm.runInContext("require('should');" + data, spectestApi, {filename: filepath, showErrors: true});
        } catch(e) {
            throw new Error(e); // run in context doesn't throw errors, just their messages
        }
        var specPath = url.resolve(filepath, assertionContext.context.spec);
        callback(assertionContext.rootAssertions, specPath);
    });
}
