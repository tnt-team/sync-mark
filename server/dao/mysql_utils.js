var mysql = require('mysql');
var async = require('async');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'marks',
    password: 'marks',
    database: 'syncmarks'
});

// pool.end(function(err) {
//     console.error('连接池已关闭' + err);
// })

function execSQL(sql, params, callback) {
    try {
        pool.getConnection(function(err, conn) {
            if (err) {
                return callback(err, null);
            }
            conn.query(sql, params, function(err, rows) {
                if (err) {
                    conn.release();
                    return callback(err, null);
                }
                callback(null, rows);
            });
        });
    } catch (e) {
        console.error(e.stack);
        callback(err);
    }
}


function execSQL_Async(sql, callback) {
    var version = null;
    try {
        async.waterfall([
            function(cb) {
                pool.getConnection(function(err, conn) {
                    if (err) {
                        return cb(err, null);
                    }
                    return cb(null, conn);
                });
            },
            function(conn, cb) {
                console.log('开始执行SQL:' + sql);
                conn.query(sql, function(err, rows) {
                    if (err) {
                        return cb(err, null);
                    }
                    return cb(null, rows);
                });
            }
        ], function(err, result) {
            if (err) {
                console.error('数据库查询失败' + err);
                conn.destroy();
                callback(err, null);
            }
            console.log("查询结果是：" + JSON.stringify(result));
            conn.release();
            callback(null, result);
        });
    } catch (e) {
        console.error(e.stack);
        callback(err, null);
    }


    // pool.getConnection(function(err, conn) {
    //     if (err) {
    //         return callback(err, null);
    //     }
    //     console.log('开始执行SQL' + sql);
    //     conn.query(sql, function(err, rows) {
    //         if (err) {
    //             return callback(err, null);
    //         }
    //         conn.release();
    //         callback(null, rows);

    //     });
    // });
}


module.exports = {
    execSQL: execSQL,
    execSQL_Async: execSQL_Async
}