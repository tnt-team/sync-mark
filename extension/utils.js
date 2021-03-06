/**
 * 获取所有书签,返回值为对象
 * @param {*回调函数} callback,有2个参数，第一个为err,第二个为获取到的书签对象
 */
function getAllMarks(callback) {
    var getItems = browser.bookmarks.getTree();
    getItems.then(function(items) {
        if (myBrowser() == 'Firefox') { //临时写法
            return callback(null, items[0]);
        }
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
    console.log('id' + id);
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
    update.then(function(item) {
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
    let get = browser.bookmarks.get(ids);
    get.then(function(items) {
        callback(null, items);
    }, function(err) {
        callback(err, null);
    });
}


// 书签储存API

/**
 * 储存对象到Storage
 * @param {*要储存的对象} obj 
 * @param {*回调} callback 
 */
function set2Storage(key, value) {
    let setting = browser.storage.local.set({ key, value });
    setting.then(null, function(err) {
        console.error('set2Storage error, key: ' + key + ', value: ' + value);
    });
}

/**
 * 从Storage中取出对象
 * @param {*取出对象主键} key 
 * @param {*} callback 
 */
function getFromStorage(key, callback) {
    let setting = browser.storage.local.get(key);
    setting.then(function(data) {
        console.log('getFromStorage:' + JSON.stringify(data));
        callback(null, data);
    }, function(err) {
        console.error('getFromStorage error, key: ' + key);
        callback(err);
    });
}


/**
 * 将书签对象转为数组形式
 * @param {*书签对象} marksObject 
 */
function parseMarks2Array(marksObject) {
    var marks = [],
        mark = {};
    mark.id = marksObject.id;
    mark.title = marksObject.title;
    mark.index = marksObject.index;
    mark.url = marksObject.url;
    mark.parentId = marksObject.parentId;
    if (!mark.parentId) {
        mark.parentId = '0';
    }
    if (!mark.url) {
        mark.url = '';
    }
    if (marksObject.children) {
        mark.type = 0;
        marks.push(mark);
        let num = marksObject.children.length;
        for (let i = 0; i < num; i++) {
            marks = marks.concat(parseMarks2Array(marksObject.children[i]));
        }
        return marks;
    } else {
        mark.type = 1;
        marks.push(mark);
        return marks;
    }

}

/**
 * 将书签对象（嵌套式）转为平行Map结构
 * @param {*书签对象} marksObject 
 */
function parseMarks2Map(marksObject) {
    var marks = {},
        mark = {},
        id = marksObject.id;
    mark.title = marksObject.title;
    mark.index = marksObject.index;
    mark.url = marksObject.url;
    mark.parentId = marksObject.parentId;
    if (marksObject.children) {
        mark.type = 0; //type为0表示文件夹
        marks[id] = mark;
        let num = marksObject.children.length;
        for (let i = 0; i < num; i++) {
            //对象合并
            marks = Object.assign(marks, parseMarks2Map(marksObject.children[i]));
        }
        return marks;
    } else {
        mark.type = 1; //type为1表示单个书签
        marks[id] = mark;
        return marks;
    }
}

function myBrowser() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Opera") > -1) {
        return "Opera";
    }
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
    }
    return "Firefox";
}


/**
 * A queue of tasks.
 * Put a task in queue by using syncTaskQueue.addSyncTask(taskfn);
 * When turn on task run, a callback will be passed on it, do not forget to call the callback when task was finish.
 */
var syncTaskQueue = (function() {
    var taskArr = [];
    var isTaskRunning = false;
    var delay = 100;
    var intervalId;

    function taskFinish() {
        isTaskRunning = false;
        if (taskArr.length === 0) {
            clearInterval(intervalId);
            intervalId = undefined;
        }
    };

    function taskRunner() {
        if (isTaskRunning) return;
        var task = taskArr.shift();
        isTaskRunning = true;
        task(taskFinish);
    }

    function startTask() {
        if (intervalId) return;
        intervalId = setInterval(taskRunner, delay);
    }

    function addSyncTask(fn) {
        taskArr.push(fn);
        startTask();
    }

    return {
        addSyncTask: addSyncTask
    }
})();
// console.log('syncTaskQueue');
// console.log(syncTaskQueue);

/**
 * a lock to protect bookmark sync in right way.
 * use tryLock to get the lock, while use isLocked to get the lock state.
 */
var bookmarkLock = (function() {
    var lockState = false;

    function tryLock() {
        if (lockState) return false;
        lockState = true;
        return true;
    }

    function isLocked() {
        return lockState;
    }

    function releaseLock() {
        if (!lockState) {
            return true;
        }
        lockState = false;
        return true;

    }

    return {
        tryLock: tryLock,
        isLocked: isLocked,
        releaseLock: releaseLock
    }
})();