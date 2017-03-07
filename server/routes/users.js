var express = require('express');
var dao = require('../dao/mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/getVersion', function(req, res) {
    var userid = req.query.userid;
    var getVersionSQL = 'select version from marksversion where userid=' + userid;

    dao.execSQL(getVersionSQL, function(err, rows) {
        if (err) {
            console.error('获取数据失败' + err);
            res.send('获取数据失败' + err);
        }
        res.setHeader('Access-Control-Allow-origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.json({ "result": rows });
    })


});

module.exports = router;