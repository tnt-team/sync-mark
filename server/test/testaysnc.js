var async = require('async');
// async.waterfall([
//     function(cb) {

//         console.log('1.1.1: ', 'start');
//         cb(null, 3);
//     },
//     function(n, cb) {
//         console.log('1.1.2: ', n);
//         cb(null, 4);
//     },
//     function(n, cb) {
//         console.log('1.1.3: ', n);
//         cb(null, n * n);
//     }
// ], function(err, result) {
//     console.log('1.1 err: ', err);
//     console.log('1.1 result: ', result);
// });
// console.log('hello world!');

var arr = [{
        id: 'toolbar_____',
        title: '书签工具栏',
        index: 1,
        url: undefined,
        parentId: 'root________',
        type: 0
    },
    {
        id: 'KvWDRt-ajYBP',
        title: '最常访问',
        index: 0,
        url: 'place:sort=8&maxResults=10',
        parentId: 'toolbar_____',
        type: 0
    },
    {
        id: 'whwaohhxoisW',
        title: 'node',
        index: 6,
        url: 'http://blog.fens.me/series-nodejs/',
        parentId: 'toolbar_____',
        type: 1
    }
];
console.log(JSON.stringify(arr));