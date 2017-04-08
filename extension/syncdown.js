var SYNC_USER_NAME_ID = 'SYNC_USER_NAME_ID';
var SYNC_MARK_VERSION = 'SYNC_MARK_VERSION';
var SYNC_INIT_DELAY = 0.1;
var SYNC_DOWN_DELAY = 10;
var REMOTE_HOST = syncmark.remoteHost; //测试服务器地址

localStorage.setItem(SYNC_USER_NAME_ID, 0); //模拟用户登录
set2Storage({ SYNC_MARK_VERSION: 1 }, function() {});

// 定时任务： 首次初始化书签
// browser.alarms.create('init_marks', {
//     delayInMinutes: SYNC_INIT_DELAY
// });

// browser.alarms.onAlarm.addListener(function(alarm) {
//     if (alarm.name != 'init_marks') {
//         return;
//     }
// });

//定时任务：定时同步书签数据
browser.alarms.create('sync', {
    periodInMinutes: SYNC_DOWN_DELAY
});


// 监听定时任务，目前每SYNC_DOWN_DELAY秒触发一次，从服务器同步数据
browser.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name != 'sync') {
        return;
    }
    var userid = localStorage.getItem(SYNC_USER_NAME_ID);
    if (!userid) {
        console.log('用户未登陆');
        browser.alarms.clear('sync');
        return;
    }
    getFromStorage(SYNC_MARK_VERSION, function(err, localVersion) {
        if (err) {
            console.error('获取本地版本号失败')
            return;
        }
        console.log('localversion:' + JSON.stringify(localVersion));
        getVersion(userid, function(err, remoteVersion) { //获取版本号
            if (err) {
                console.error('获取远程版本号失败');
                return;
            }
            if (remoteVersion <= localVersion) { //远程比本地版本小或相等
                console.log('不需同步');
                if (remoteVersion != localVersion) {
                    let obj = { version: remoteVersion };
                    set2Storage(obj, function() {});
                }
            }
            if (remoteVersion > localVersion) { //服务器的版本较新
                downAllData(userid, function(err, remoteMrks) { //获取服务器书签数据
                    if (err) {
                        console.error('获取服务器书签数据失败');
                    }
                    getAllMarks(function(err, localMarks) { //获取浏览器书签
                        if (err) {
                            console.log('获取本地书签错误');
                            return;
                        }
                        console.log('同步开始：');
                        updateLocalMarks(localMarks, remoteMrks, function(err) {
                            if (err) {
                                console.log('同步失败');
                            }
                            let obj = { SYNC_MARK_VERSION: remoteVersion };
                            set2Storage(obj, function() {});
                        });
                    });
                });
            }
        });
    });
});

//初始化书签
function initMarks() {
    console.error('开始初始化');
    var userid = localStorage.getItem(SYNC_USER_NAME_ID);
    if (!userid) {
        console.log('用户未登陆');
        browser.alarms.clear('sync');
        return;
    }
    // var version = localStorage.getItem(SYNC_MARK_VERSION);

    //向服务器初始化书签，测试用
    getAllMarks(function(err, items) { //获取浏览器书签
        if (err) {
            console.log('获取本地书签错误');
            return;
        }
        var marksArr = parseMarks2Array(items);
        batchUpdateMarks(userid, marksArr, function(err) {
            if (err) {
                console.error('向服务器初始化书签错误');
                return;
            }
            console.log('初始化成功');
        });
    });
}


/**
 * 从服务器下载数据
 */
function downAllData(userid, callback) {
    var marksData = {};
    console.error('开始下载数据');
    var browser_type = myBrowser();
    $.ajax({
        url: REMOTE_HOST + '/marks/getAll',
        type: 'get',
        data: { userid: userid, browser_type: browser_type },
        success: function(data) {
            marksData = data.result;
            callback(null, marksData);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('请求失败:' + JSON.stringify(XMLHttpRequest));
            console.log(textStatus);
            callback(textStatus, null);
        }
    });
}

/**
 * 获取版本号
 * @param {*用户id} userid 
 * @param {*回调} callback 
 */
function getVersion(userid, callback) {
    $.ajax({
        url: REMOTE_HOST + '/users/getVersion',
        type: 'get',
        data: { userid: userid },
        success: function(data) {
            if (data.error) {
                console.error('获取版本号失败');
                callback(err, null);
                return;
            }
            var curVersion = data.result[0].version;
            console.log(JSON.stringify('result:' + JSON.stringify(curVersion)));
            callback(null, curVersion);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('请求失败:' + JSON.stringify(XMLHttpRequest));
            console.log(textStatus);
            callback(textStatus, null);
        }
    });
}

/**
 * 批量更新书签
 * @param {*书签数组} marks 
 * @param {*回调} callback 
 */
function batchUpdateMarks(userid, marksArr, callback) {
    $.ajax({
        url: REMOTE_HOST + '/marks/batchUpdate',
        type: 'post',
        data: { userid: userid, marksArr: JSON.stringify(marksArr) },
        success: function(data) {
            if (data.error) {
                return callback(data.error);
            }
            //设置版本号
            let version = { version: data.result[0].version };
            set2Storage(version, function(err) {
                if (err) {
                    return callback(err, null);
                }
                callback(null);
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            callback(textStatus);
        }
    })
}

/**
 * 根据远程更新本地书签
 * @param {*本地书签} localMarks 
 * @param {*远程书签} remoteMrks 
 */
function updateLocalMarks(localMarks, remoteMarks, callback) {
    var marksMap = parseMarks2Map(localMarks);
    remoteMarks.forEach(function(item) {
        let mark = marksMap[item.markid];
        if (!mark) { //本地少书签
            createMark(item, function() {
                if (err) {
                    callback(err);
                }
            });
        } else {
            mark.isExist = 1;
            let isTitle = item.title == mark.title ? null : item.title;
            let isUrl = item.url == mark.url ? null : item.url;
            updateMark(item.markid, isTitle, isUrl, function(err) {
                callback(err);
            });
        }
    });
    $.each(marksMap, function(attr, value) {
        if (!value.isExist) {
            deleteMarkById(attr, function(err) {
                if (err) {
                    callback(err);
                }
                console.log('删除书签：' + value.title);
                callback(null);
            });
        }
    });
}