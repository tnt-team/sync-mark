var mysql = require('mysql');
var async = require('async');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'marks',
    password: 'marks',
    database: 'syncmarks'
});

function execSQL(sql, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            console.error('execSQL: get connection error: ' + err.message || '' + ' '+ err.stack || '');
            return callback(err, null);
        }
        conn.query(sql, function(err, rows) {
            // release the connection to pool
            conn.release();

            if (err) {
                console.error('execSQL: exec sql error, ' + err.message || '' + ' '+ err.stack || '');
                callback(err, null);
            }
            callback(null, rows);
        });
    });
}


function execSQL_Async(sql, callback) {
    var version = null;
    try {
        async.waterfall([
            function(cb) {
                pool.getConnection(function(err, conn) {
                    if (err) {
                        console.error('execSQL_Async: get connection error, ' + err.message || '' + ' '+ err.stack || '');
                        return cb(err, null);
                    }
                    return cb(null, conn);
                });
            },
            function(conn, cb) {
                console.log('开始执行SQL:' + sql);
                conn.query(sql, function(err, rows) {
                    // release the connection to pool
                    conn.release();

                    if (err) {
                        console.error('execSQL_Async: exec sql error, ' + err.message || '' + ' '+ err.stack || '');
                        return cb(err, null);
                    }
                    return cb(null, rows);
                });
            }
        ], function(err, result) {
            if (err) {
                console.error('数据库查询失败' + err);
                callback(err, null);
            }
            console.log("查询结果是：" + JSON.stringify(result));
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

function escapeField(fieldData) {
    return mysql.escape(fieldData);
}


module.exports = {
    execSQL: execSQL,
    execSQL_Async: execSQL_Async,
    escapeField: escapeField
}