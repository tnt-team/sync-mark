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

module.exports = {
    getAllMarks: getAllMarks,
    addMarksBatch: addMarksBatch

}