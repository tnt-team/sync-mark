var dao = require('./mysql_utils');

/**
 * 获取指定用户版本号
 * @param {*用户id} userid 
 */
function getVersion(userid, callback) {
    var sql = 'select version from  usermarks where userid=?';
    var params = [userid];
    dao.execSQL(sql, params, callback);
}

module.exports = {
    getVersion: getVersion
}