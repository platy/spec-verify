/*
Does node-side loading of assertion files
 */
var fs = require('fs'),
    vm = require('vm'),
    path = require('path');
import {contextGenerator} from './assertion-context';


export function load(filepath, callback) {
    console.log("Loading: ", filepath);
    var assertionContext = contextGenerator();
    var spectestApi = vm.createContext(assertionContext.context);

    fs.readFile(filepath, (err, data) => {
        if (err) throw err;
        vm.runInContext(data, spectestApi, {filename: filepath, showErrors: true});
        var specPath = path.resolve(filepath, '..', assertionContext.context.spec);
        callback(assertionContext.rootAssertions, specPath);
    });
}
