/*
Does node-side loading of assertion files
 */
var fs = require('fs'),
    vm = require('vm');
import {contextGenerator} from './assertion-context';


export function load(filepath, callback) {
    console.log("Loading: ", filepath, callback, contextGenerator);
    var assertionContext = contextGenerator();
    var spectestApi = vm.createContext(assertionContext.context);

    fs.readFile(filepath, (err, data) => {
        if (err) throw err;
        vm.runInContext(data, spectestApi, {filename: filepath, showErrors: true});
        callback(assertionContext.rootAssertions);
    });
}
