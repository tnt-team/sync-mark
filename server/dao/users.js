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

/**
 * 保存邮箱验证码
 * @param {*邮箱} email 
 * @param {*验证码} code 
 * @param {*回调} callback 
 */
function saveMailCode(email, code, callback) {
    var sql = 'insert into emailcode(email,code,createtime) VALUES(?,?,？)';
    var date = new Date();
    var param = [email, code, date];
    dao.execSQL(sql, param, callback);
}

/**
 * 获取邮箱验证码
 * @param {*} email 
 * @param {*} code 
 * @param {*} callback 
 */
function getMailCode(email, callback) {
    var sql = 'select code from emailcode where email = ?';
    var param = [email];
    dao.execSQL(sql, param, callback);
}

/**
 * 用户注册
 * @param {*注册邮箱} email 
 * @param {*密码} password 
 * @param {*回调} callback 
 */
function register(email, password, callback) {




}

module.exports = {
    getVersion,
    saveMailCode,
    getMailCode,
    register
}