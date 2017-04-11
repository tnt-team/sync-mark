//常用SQL
var GET_VERSION_SQL = 'select version from usermarks where userid = ?';

var INC_VERSION_SQL = 'update usermarks set version=version+1 where userid=?';


var COMMON_SQL = {
    GET_VERSION_SQL: GET_VERSION_SQL,
    INC_VERSION_SQL: INC_VERSION_SQL
}

//用户相关

//邮件
var MAIL_AUTH_SUBJECT = '欢迎使用书签同步工具';
var MAIL_RELATED = {
    MAIL_AUTH_SUBJECT
}


module.exports = {
    COMMON_SQL,
    MAIL_RELATED
}