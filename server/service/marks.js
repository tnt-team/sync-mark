/**
 * 书签service层
 */

var dao = require('../dao/mysql');
var packres = require('../service/packresponse');

/**
 * 根据用户id获取所有书签
 * @param {*用户id} userid 
 */
function getAllMarks(userid) {
    var selectAllSQL = 'select * from bookmark b where b.userid = ' + userid;
    dao.execSQL(selectAllSQL, function(err, rows) {
        try {
            if (err) {
                console.log('获取数据失败');
                res.send('获取数据失败' + err);
            }
            console.log(JSON.stringify(rows));
            return rows;
        } catch (e) {
            console.error(e);
        }
    });
}

module.exports = {
    getAllMarks: getAllMarks
}