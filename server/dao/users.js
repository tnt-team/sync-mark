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
    var sql = 'insert into emailcode(email,code,createtime) VALUES(?,?,?)';
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
 * @param {*加密密码} password 
 * @param {*回调} callback 
 */
function register(email, password, callback) {
    var date = new Date();
    var sql = 'insert into users(email,password,registertime) values(?,?,?)';
    var param = [email, password, date];
    dao.execSQL(sql, param, callback);
}

function login(email, callback) {
    var sql = 'select password from users where email = ?';
    var params = [email];
    dao.execSQL(sql, params, callback);
}

module.exports = {
    getVersion,
    saveMailCode,
    getMailCode,
    register,
    login
}