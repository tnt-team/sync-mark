var dao = require('./mysql_utils');

/**
 * 根据用户id获取所有书签
 * @param {*用户id} userid 
 */
function getAllMarks(userid, callback) {
    var selectAllSQL = 'select * from bookmark b where b.userid = ' + userid;
    dao.execSQL(selectAllSQL, callback);
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
    createUserMarks: createUserMarks
}