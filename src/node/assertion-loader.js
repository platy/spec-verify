/*
Does node-side loading of assertion files
 */
var fs = require('fs'),
    vm = require('vm'),
    url = require('url'),
    System = require('es6-module-loader').System;

System.paths['assertion-context'] = 'src/assertion-context.js';
System.paths['should'] = 'node_modules/should/should.js';

export function load(filepath, callback) {
    console.error("Loading: ", filepath);

    // remove js to get the module name
    filepath = filepath.replace(/(.*)\.js$/, "$1");
    System.import(filepath).then(function(module) {
        var specPath = url.resolve(filepath, module.spec);
        callback(module.rootAssertions, specPath);
    });
}
