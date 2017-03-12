var async = require('async');
async.waterfall([
    function(cb) {
        
        console.log('1.1.1: ', 'start');
        cb(null, 3);
    },
    function(n, cb) {
        console.log('1.1.2: ', n);
        cb(null, 4);
    },
    function(n, cb) {
        console.log('1.1.3: ', n);
        cb(null, n * n);
    }
], function(err, result) {
    console.log('1.1 err: ', err);
    console.log('1.1 result: ', result);
});
console.log('hello world!');