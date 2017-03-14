var express = require('express');
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


router.get('/getAll', function(req, res) {
    var userid = req.query.userid;
    dao_marks.getAllMarks(userid, function(err, data) {
        if (err) {
            return utils.error2json(res, err);
        }
        utils.result2json(res, data);
    });

});


router.post('/batchUpdate', function(req, res) {
    var userid = req.body.userid;
    var marksArr = JSON.parse(req.body.marksArr);
    dao_marks.addMarksBatch(userid, marksArr, function(err, result) {
        if (err) {
            utils.error2json(res, err);
            return;
        }
        console.log('批量更新成功');
        utils.result2json(res, result);
    })
});

router.get('/syncUp', function(req, res) {
    var userid = req.query.userid;
    var syncUpItems = req.query.syncUpItems;
    var syncUpItemsArr = JSON.parse(syncUpItems);
    var createArr = [],
        removeArr = [],
        changeArr = [],
        moveArr = [],
        reorderArr = [];
    var ix, item;
    for (ix = 0; ix < syncUpItemsArr.length; ix++) {
        item = syncUpItemsArr[ix];
        switch (item.type) {
            case SYNC_ITEM_TYPES.create:
                createArr.push(item);
                break;
            case SYNC_ITEM_TYPES.remove:
                removeArr.push(item);
                break;
            case SYNC_ITEM_TYPES.change:
                changeArr.push(item);
                break;
            case SYNC_ITEM_TYPES.move:
                moveArr.push(item);
                break;
            case SYNC_ITEM_TYPES.reorder:
                reorderArr.push(item);
                break;
        }
    }
    // todo
    async.parallel({
        createItems: function() {
            // todo
        },
        removeItems: function() {
            // todo
        },
        updateItems: function() {
            // todo
        },
        updateVersion: function() {
            // todo
        }
    }, function(err, results) {
        if (err.length > 0) {
            utils.error2json(res, err);
            return;
        }
        // todo
        var newVersion = results.updateVersion;
        utils.result2json(res, newVersion);
    });

});

module.exports = router;