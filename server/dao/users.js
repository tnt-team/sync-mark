var dao = require('./mysql_utils');

/**
 * 获取指定用户版本号
 * @param {*用户id} userid 
 */
function getVersion(userid, callback) {
    var sql = 'select version from  usermarks where userid=' + userid;
    dao.execSQL(sql, callback);
}

module.exports = {
    getVersion: getVersion
}