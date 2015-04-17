import {load} from './assertion-loader';
import {run} from './assertion-runner';

load(process.argv[2], function (as) {
    console.log(as.length + " root assertions");
    as.forEach(function (a) {
        console.log('  ' + a.toString());
    });
    console.log("Total assertions");
    as.forEach(function (r) {
        console.log('  ' + r.description);
        if (r.cases) r.cases.forEach(function (rcase) {
            console.log('    ' + rcase);
        })
    });

    var result = run(as, ['document', { data: {} }]);
    result.failingChildren.forEach(failure => {
        console.log(`FAILURE: ${failure.description}
        ${failure.failureError}`);
    });
    console.log(result.summary);
});
