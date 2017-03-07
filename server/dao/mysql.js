var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'marks',
    password: 'marks',
    database: 'syncmarks'
});


function execSQL(sql, callback) {
    pool.getConnection(function(err, conn) {
        if (err) {
            return callback(err, null);
        }
        console.log('开始执行SQL' + sql);
        conn.query(sql, function(err, rows) {
            if (err) {
                return callback(err, null);
            }
            conn.release();
            callback(null, rows);

        });
    });
}

module.exports = {
    execSQL: execSQL
}