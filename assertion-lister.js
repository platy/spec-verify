

module.exports = function(rootAssertions) {
    var allAssertions = [];

    rootAssertions.forEach(function (r) {
        allAssertions.push(r.description);
        console.log(r);
        //Array.prototype.slice.call(r.bodies, 1).forEach(function (body) {
        //    body();
        //});
    });
    console.log(allAssertions);
    return allAssertions;
};
