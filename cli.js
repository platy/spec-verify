
require('./assertion-loader.js')(process.argv[2], function(as){
    console.log(as.length + " root assertions");
    as.forEach(function(a){
        console.log('  ' + a.toString());
    });
    var allAssertions = [];
    as.forEach(function(r){
        allAssertions.push(r.description);
        if(r.cases)
            Array.prototype.push.apply(allAssertions, r.cases)
    });
    console.log(allAssertions.length + " total assertions");
    allAssertions.forEach(function(a){
        console.log('  ' + a);
    });
});
