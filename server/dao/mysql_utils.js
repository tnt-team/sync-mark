var mysql = require('mysql');
var async = require('async');
var pool = mysql.createPool({
    host: 'sqld.duapp.com',
    user: 'username',
    password: 'password',
    database: 'syncmark'
});

// pool.end(function(err) {
//     console.error('连接池已关闭' + err);
// })


/**
 * 执行SQL
 * @param {*sql语句} sql 
 * @param {*参数} params 
 * @param {*回调} callback 
 */
function execSQL(sql, params, callback) {
    try {
        pool.getConnection(function(err, conn) {
            if (err) {
                console.error('execSQL: get connection error: ' + err.message || '' + ' ' + err.stack || '');
                return callback(err, null);
            }
            conn.query(sql, params, function(err, rows) {
                // release the connection to pool
                conn.release();
                if (err) {
                    console.error('execSQL: exec sql error, ' + err.message || '' + ' ' + err.stack || '');
                    callback(err, null);

                }
                callback(null, rows);
            });

        });
    } catch (e) {
        console.error(e.stack);
        callback(err);
    }
}


/**
 * 事务执行SQL
 * @param {*执行的sql对象数组，每个元素包含sql和params两个属性} sqls 
 * @param {*回调} callback 
 */
function execSQL4Trans(sqls, callback) {
    try {
        pool.getConnection(function(err, conn) {
            if (err) {
                console.error('execSQL4Trans 获取连接池失败');
                return callback(err, null);
            }
            conn.beginTransaction(function(terr) {
                if (err) {
                    console.error('开启事务失败' + terr);
                    return callback(terr, null);
                }
                var tasks = [];
                sqls.forEach(function(sqlParam) {
                    var sql = sqlParam.sql;
                    var params = sqlParam.params;
                    var temp = function(cb) {
                        conn.query(sql, params, function(err, rows) {
                            if (err) {
                                return cb(err, null);
                            }
                            cb(null, rows);
                        });
                    };
                    tasks.push(temp);
                });
                async.series(tasks, function(aerr, result) {
                    if (aerr) {
                        conn.rollback(function() {
                            console.error('事务执行失败' + aerr.stack);
                            return callback(aerr, null);
                        });
                        
                    }
                    conn.commit(function(err, info) {
                        if (err) {
                            console.error('提交失败');
                            callback(err, null);
                        }
                        console.log('事务执行成功:' + JSON.stringify(info));
                        console.log('执行结果为：' + result);
                        callback(null, result);
                    });

                });
            })
        });
    } catch (e) {
        callback(err, null);
    }
}

function execSQL_Async(sql, callback) {
    var version = null;
    try {
        async.waterfall([
            function(cb) {
                pool.getConnection(function(err, conn) {
                    if (err) {
                        console.error('execSQL_Async: get connection error, ' + err.message || '' + ' ' + err.stack || '');
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
                        console.error('execSQL_Async: exec sql error, ' + err.message || '' + ' ' + err.stack || '');
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
}

function escapeField(fieldData) {
    return mysql.escape(fieldData);
}


module.exports = {
    execSQL: execSQL,
    execSQL_Async: execSQL_Async,
    escapeField: escapeField,
    execSQL4Trans: execSQL4Trans
}