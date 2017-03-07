var express = require('express');
var dao = require('../dao/mysql');
var router = express.Router();


router.get('/getAll', function(req, res) {

    var selectAllSQL = 'select * from bookmark b where b.userid = ' + req.query.userid;

    dao.execSQL(selectAllSQL, function(err, rows) {
        try {
            if (err) {
                console.log('获取数据失败');
                res.send('获取数据失败' + err);
            }
            console.log(JSON.stringify(rows));
            res.setHeader('Access-Control-Allow-origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.json({ "result": rows });
        } catch (e) {
            console.error(e);
        }
    });
});
module.exports = router;