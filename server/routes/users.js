var express = require('express');
var dao_users = require('../dao/users');
var utils = require('../utils');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/getVersion', function(req, res) {
    var userid = req.query.userid;

    dao_users.getVersion(userid, function(err, data) {
        if (err) {
            utils.error2json(res, err);
        }
        console.log('getVersion:' + JSON.stringify(data));
        utils.result2json(res, data);
    });
});

module.exports = router;