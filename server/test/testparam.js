var uuid = require('uuid/v1');

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


function appendId4Marks(marksArr, browser_type) {
    var marksMap = {};
    //组装id-index对应Map
    marksArr.forEach(function(item, index) {
        marksMap[item.id] = index;
    });
    console.log('marksMap:' + JSON.stringify(marksMap));
    for (var i = 0; i < marksArr.length; i++) {
        var item = marksArr[i];
        if (!item._id) {
            item._id = uuid(); //生成id
            var pIndex = marksMap[item.parentId];
            if (pIndex == undefined) {
                item._pid = '';
                continue;
            }
            var pItem = marksArr[pIndex];
            if (!pIndex._id) {
                var pid = uuid();
                pItem._id = pid;
            }
            item._pid = pid;
        }
    };
    return marksArr;
}
// console.log(appendId4Marks(arr));
console.log(appendId4Marks(arr));