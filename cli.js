require("babel/register");

require('./assertion-loader.js')(process.argv[2], function(as){
    console.log(as.length + " root assertions");
    as.forEach(function(a){
        console.log('  ' + a.toString());
    });
    console.log("Total assertions");
    as.forEach(function(r){
        console.log('  ' + r.description);
        if(r.cases) r.cases.forEach(function(rcase){
            console.log('    ' + rcase);
        })
    });
});
