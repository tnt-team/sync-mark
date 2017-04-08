var dao = require('./mysql_utils');
var constant = require('../constant');

var firefox_markid = 'fx_markid';
var chrome_markid = 'cr_markid';
var firefox_markparentid = 'fx_markparentid';
var chrome_markparentid = 'cr_markparentid';

/**
 * 根据用户id获取所有书签
 * @param {*用户id} userid 
 */
function getAllMarks(userid, broswer, callback) {
    var selectAllSQL = useSelectSQLByBroswer(broswer);
    var params = [userid];
    dao.execSQL(selectAllSQL, params, callback);
}

/**
 * 批量添加用户书签
 * @param {*用户id} userid 
 * @param {*书签数组} marksArr 
 * @param {*回调} callback 
 */
function addMarksBatch(userid, marksArr, browser_type, callback) {
    var dataSQL = [],
        insertSQL = '',
        num = marksArr.length;
    for (let i = 0; i < num; i++) {
        let arr = [];
        //数据库id、pid
        arr.push(marksArr[i]._id);
        arr.push(marksArr[i]._pid);
        arr.push(parseInt(userid));
        //浏览器id、pid
        arr.push(marksArr[i].id);
        arr.push(marksArr[i].parentId);
        arr.push(marksArr[i].title);
        arr.push(marksArr[i].index);
        arr.push(marksArr[i].type);
        arr.push(marksArr[i].url);
        if (i == 0) {
            insertSQL = '(?)';
        } else if (i != num) {
            insertSQL = insertSQL + ',' + '(?)';
        } else {
            insertSQL = insertSQL + '(?)';
        }
        dataSQL.push(arr);
    }

    var batchSQL = useInsertSQLByBrowser(browser_type) + insertSQL;
    var batchParams = dataSQL;

    var updateVersionSQL = constant.COMMON_SQL.INC_VERSION_SQL;

    var getVersionSQL = constant.COMMON_SQL.GET_VERSION_SQL;
    var versionParam = [{ userid: userid }];
    var sqls = [{ sql: batchSQL, params: batchParams }, { sql: updateVersionSQL, params: versionParam }, { sql: getVersionSQL, params: versionParam }];
    dao.execSQL4Trans(sqls, callback);

}

/**
 * 根据浏览器选择插入SQL,默认为火狐
 * @param {*浏览器标识} browser 
 */
function useInsertSQLByBrowser(browser) {
    var sql = '';
    if (browser == 'Chrome') {
        sql = 'insert into bookmark(id,parentid,userid,cr_markid,cr_markparentid,title,index,type,url) values ';
    } else {
        sql = 'insert into bookmark(id,parentid,userid,fx_markid,fx_markparentid,title,index,type,url) values ';
    }
    return sql;
}

function useSelectSQLByBroswer(broswer) {
    var sql = '';
    if (broswer == 'Chrome') {
        sql = 'select cr_markid as markid,cr_markparentid as markparentid,id as _id,parentid as _pid,userid,title,index,type,url from bookmark where userid = ?';
    } else {
        sql = 'select fx_markid as markid,fx_markparentid as markparentid,id as _id,parentid as _pid,userid,title,index,type,url from bookmark where userid = ?';
    }
    return sql;
}

/**
 * create marks for user
 * @param {Number} userid id of user
 * @param {Function} callback called when things were done
 */
function createUserMarks(userId, createArr, callback) {
    var insertHead = 'insert into bookmark (name, order, type, parentId, userId) values ';
    var ix, item, insertBody = '';
    for (ix = 0; ix < createArr.length; ix++) {
        item = createArr[ix];
        if (ix !== 0) insertBody += ',';
        insertBody += '(';
        // name
        insertBody += dao.escapeField(item.title) + ',';
        // order
        insertBody += dao.escapeField(item.index) + ',';
        // type todo
        // parentId todo
        // userid
        insertBody += userId + ',';
        // gentime todo format

        insertBody += ')';
    }
    var insertSql = insertHead + insertBody;
    dao.execSQL(insertSql, callback);
}

module.exports = {
    getAllMarks: getAllMarks,

    addMarksBatch: addMarksBatch,

    createUserMarks: createUserMarks,

    chrome_markid: chrome_markid,
    firefox_markid: firefox_markid,
    chrome_markparentid: chrome_markparentid,
    firefox_markparentid: firefox_markparentid
}