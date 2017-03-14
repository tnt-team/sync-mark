var dao = require('./mysql_utils');

/**
 * 根据用户id获取所有书签
 * @param {*用户id} userid 
 */
function getAllMarks(userid, callback) {
    var selectAllSQL = 'select * from bookmark b where b.userid = ?';
    var params = [userid];
    dao.execSQL(selectAllSQL, params, callback);
}

function addMarksBatch(userid, marksArr, callback) {
    var dataSQL = [],
        insertSQL = '',
        num = marksArr.length;
    for (let i = 0; i < num; i++) {
        let arr = [];
        arr.push(parseInt(userid));
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

    var sql = 'insert into bookmark (userid,markid,markparentid,title,`index`,`type`,url) values ' + insertSQL;
    var params = dataSQL;
    dao.execSQL(sql, params, callback);

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
<<<<<<< HEAD
    addMarksBatch: addMarksBatch

=======
    createUserMarks: createUserMarks
>>>>>>> 43f730a151da00ade2b6d0845a709ece1314b50b
}