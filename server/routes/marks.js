var express = require('express');
var async = require('async');
var uuid = require('uuid/v1');
var dao_marks = require('../dao/marks');
var utils = require('../utils');
var router = express.Router();

var SYNC_ITEM_TYPES = {
    create: 'create',
    remove: 'remove',
    change: 'change',
    move: 'move',
    reorder: 'reorder'
};

var CLIENT_TYPES = {
    firefox: 'firefox',
    chrome: 'chrome'
}


router.get('/getAll', function(req, res) {
    var userid = req.query.userid;
    var browser = req.query.browser_type;
    dao_marks.getAllMarks(userid, browser, function(err, data) {
        if (err) {
            return utils.error2json(res, err);
        }
        utils.result2json(res, data);
    });

});



router.post('/batchUpdate', function(req, res) {
    var userid = req.body.userid;
    var marksArr = JSON.parse(req.body.marksArr);
    var browser_type = req.body.browser;
    marksArr = appendId4Marks(marksArr); //重新包装
    dao_marks.addMarksBatch(userid, marksArr, browser_type, function(err, result) {
        if (err) {
            utils.error2json(res, err);
            return;
        }
        console.log('批量更新成功');
        console.log('result：' + result);
        utils.result2json(res, result);
    })
});


router.get('/syncUp', function(req, res) {
    var userId = req.query.userId;
    var agentFlag = req.query.agentFlag;
    var syncUpItems = req.query.syncUpItems;
    var syncUpType = req.query.syncUpType;
    var syncUpItemsArr = JSON.parse(syncUpItems);

    if (syncUpType === SYNC_ITEM_TYPES.create) {
        var createItemArr = [];
        var createIdDict = {};
        var createClientIdDict = {};
        var createUnknowParentItemArr = [];
        syncUpItemsArr.forEach(function(item) {
            id,parentid,userid,cr_markid,cr_markparentid,title,index,type,url
            var createItem = {};
            createItem.id = uuid();
            createItem.userId = userId;
            if (syncUpType === CLIENT_TYPES.chrome) {
                createItem[dao_marks.chrome_markid] = item.id;
                createItem[dao_marks.chrome_markparentid] = item.parentId;
            }
            else if (syncUpType === CLIENT_TYPES.firefox) {
                createItem[dao_marks.firefox_markid] = item.id;
                createItem[dao_marks.firefox_markparentid] = item.parentId;
            }
            else {
                console.error('error syncUpType: ' + syncUpType);
            }
            createItem.title = item.title;
            createItem.index = item.index;
            // bookmark type todo
            createItem.type = typeof item.url === 'string' ? 'bookmark': 'folder';
            if (typeof item.url === 'string') createItem.url = item.url;
            if (typeof item.parentId === 'string') {
                if (createClientIdDict[item.parentId]) {
                    createItem.parentId = createClientIdDict[item.parentId].id;
                } else {
                    createUnknowParentItemArr.push(createItem);
                }
            }
            createIdDict[createItem.id] = createItem;
            createClientIdDict[item.id] = createItem;
            createItemArr.push(createItem);
        })
        async.waterfall([
            function(done) {

            },
        ], function() {

        });
        dao_marks.createUserMarks(userId, createArr, function() {
            lineFinish(null, null);
        });
    }


    // var createArr = [],
    //     removeArr = [],
    //     changeArr = [],
    //     moveArr = [],
    //     reorderArr = [];
    // var ix, item;
    // for (ix = 0; ix < syncUpItemsArr.length; ix++) {
    //     item = syncUpItemsArr[ix];
    //     // todo other agent
    //     switch (item.type) {
    //         case SYNC_ITEM_TYPES.create:
    //             createArr.push(item.bookmark);
    //             var bookmark;
    //             if (agentFlag === 'firefox') {
    //                 bookmark = {
    //                     name: item.bookmark.title,
    //                     order: item.bookmark.index,
    //                     order: item.bookmark.index,
    //                 };
    //             }

    //             break;
    //         case SYNC_ITEM_TYPES.remove:
    //             removeArr.push(item.removeInfo);
    //             break;
    //         case SYNC_ITEM_TYPES.change:
    //             changeArr.push(item.changeInfo);
    //             break;
    //         case SYNC_ITEM_TYPES.move:
    //             moveArr.push(item.moveInfo);
    //             break;
    //         case SYNC_ITEM_TYPES.reorder:
    //             reorderArr.push(item.reorderInfo);
    //             break;
    //     }
    // }
    // todo
    // async.parallel({
    //     createItems: function(lineFinish) {
    //         // todo query all parentIds
            
    //         dao_marks.createUserMarks(userId, createArr, function() {
    //             lineFinish(null, null);
    //         });
    //     },
    //     removeItems: function() {
    //         // todo
    //     },
    //     updateItems: function() {
    //         // todo
    //     },
    //     updateVersion: function() {
    //         // todo
    //     }
    // }, function(err, results) {
    //     if (err.length > 0) {
    //         utils.error2json(res, err);
    //         return;
    //     }
    //     // todo
    //     var newVersion = results.updateVersion;
    //     utils.result2json(res, newVersion);
    // });
    //todo

});


/**
 * 为书签数组添加id及pid
 * @param {* 书签数组} marksArr 
 */
function appendId4Marks(marksArr) {
    var marksMap = {};
    //组装id-index对应Map
    marksArr.forEach(function(item, index) {
        marksMap[item.id] = index;
    });
    for (var i = 0; i < marksArr.length; i++) {
        var item = marksArr[i];
        if (!item._id) {
            item._id = uuid(); //生成id
        }
        var pIndex = marksMap[item.parentId];
        if (pIndex == undefined) {
            item._pid = '';
            continue;
        }
        var pItem = marksArr[pIndex];
        if (!pItem._id) {
            var pid = uuid(); //生成pid
            pItem._id = pid;
            item._pid = pid;
        } else {
            item._pid = pItem._id;
        }

    };
    console.log(marksArr);
    return marksArr;
}

module.exports = router;