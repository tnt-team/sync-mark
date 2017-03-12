var express = require('express');
var dao_marks = require('../dao/marks');
var utils = require('../utils');
var router = express.Router();


router.get('/getAll', function(req, res) {
    var userid = req.query.userid;
    dao_marks.getAllMarks(userid, function(err, data) {
        if (err) {
            return utils.error2json(res, err);
        }
        utils.result2json(res, data);
    });

});

module.exports = router;