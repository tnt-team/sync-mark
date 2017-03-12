var dao = require('./mysql_utils');

/**
 * 根据用户id获取所有书签
 * @param {*用户id} userid 
 */
function getAllMarks(userid, callback) {
    var selectAllSQL = 'select * from bookmark b where b.userid = ' + userid;
    dao.execSQL(selectAllSQL, callback);
}

module.exports = {
    getAllMarks: getAllMarks
}