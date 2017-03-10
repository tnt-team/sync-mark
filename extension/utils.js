/**
 * 获取所有书签
 * @param {*回调函数} callback 
 */
function getAllMarks(callback) {
    var getItems = browser.bookmarks.getTree();
    getItems.then(function(items) {
        callback(null, items);
    }, function(err) {
        callback(err, null);
    });
}

/**
 * 根据书签id删除书签
 * @param {*书签id} id 
 * @param {*回调} callback,若删除错误，第一个参数为err
 */
function deleteMarkById(id, callback) {
    var del = browser.bookmarks.remove(id);
    del.then(function() {
        callback(null);
    }, function(err) {
        callback(err);
    });
}

/**
 * 创建书签
 * @param {*书签对象} deatil 
 * @param {*回调} callback 
 */
function createMark(deatil, callback) {
    var create = browser.bookmarks.create(deatil);
    create.then(function(items) {
        callback(null, items);
    }, function(err) {
        callback(err, null);
    })
}

/**
 * 更改书签名称或url,为空表示不修改
 * @param {*书签id} id 
 * @param {* 书签名} title 
 * @param {*书签url} url 
 * @param {*回调} callback 
 */
function updateMark(id, title, url, callback) {
    var change = {};
    if (title) change.title = title;
    if (url) change.url = url;
    update = browser.bookmarks.update(id, change);
    updateMark.then(function(item) {
        callback(null, item);
    }, function(err) {
        callback(err, null);
    })
}

/**
 * 根据id或id数组获取书签
 * @param {*书签id数组} ids
 * @param {*回调} callback 
 */
function getByIdOrArray(ids, callback) {
    get = browser.bookmarks.get(ids);
    get.then(function(items) {
        callback(null, items);
    }, function(err) {
        callback(err, null);
    });
}

/**
 * 将书签对象转为数组形式
 * @param {*书签对象} marksObject 
 */
function parseMarkArray(marksObject) {
    var marks = [];
    



}