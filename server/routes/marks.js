var express = require('express');
var mysql = require('mysql');
var router = express.Router();


router.get('/getAll/:id', function(req, res) {

    var selectAllSQL = 'select * from bookmark b where b.userid = ' + req.params.id;

    var pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'wangtonghe',
        database: 'nodetest'
    });
    // console.log(pool);


    pool.getConnection(function(err, connection) {
        console.log(err);
        if (err) {
            console.log('获取链接失败');
            return;
        }
        console.log("sql:" + selectAllSQL);
        connection.query(selectAllSQL, function(err, rows) {
            try {
                if (err) {
                    console.log('获取数据失败');
                    mysql.resovle();
                }
                console.log(JSON.stringify(rows));
                res.setHeader('Access-Control-Allow-origin', 'http://localhost:3000');
                res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
                res.setHeader('Access-Control-Allow-Credentials', true);
                res.json({ "result": rows });
            } catch (e) {
                console.error(e);
            }
        });
    });
});
module.exports = router;