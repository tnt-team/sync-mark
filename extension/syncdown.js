var SYNC_USER_NAME_ID = 'SYNC_USER_NAME_ID';
var SYNC_MARK_VERSION = 'SYNC_MARK_VERSION';
var SYNC_DOWN_DELAY = 0.1;
var REMOTE_HOST = syncmark.remoteHost; //测试服务器地址

localStorage.setItem(SYNC_USER_NAME_ID, 1); //模拟用户登录
localStorage.setItem(SYNC_MARK_VERSION, 0); //模拟版本号

//创建定时任务
browser.alarms.create('sync', {
    // periodInMinutes: SYNC_DOWN_DELAY
    delayInMinutes: SYNC_DOWN_DELAY
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
    var version = localStorage.getItem(SYNC_MARK_VERSION);

    //向服务器初始化书签，测试用
    getAllMarks(function(err, items) { //获取浏览器书签
        if (err) {
            console.log('获取本地书签错误');
            return;
        }
        var marksArr = parseMarks2Array(items[0]);
        console.log('marksArr' + marksArr);
        batchUpdateMarks(userid, marksArr, function(err) {
            if (err) {
                console.error('向服务器初始化书签错误');
                return;
            }
            console.log('同步成功');
        });
    });





    // getVersion(userid, function(err, curVersion) { //获取版本号
    //     if (!curVersion) {
    //         console.error(curVersion);
    //         //TODO 本地比服务器的新 待处理
    //     }
    //     if (curVersion > version) { //服务器的版本较新
    //         downAllData(userid, function(err, data) { //获取服务器书签数据
    //             if (err) {
    //                 console.error('获取服务器书签数据失败');
    //             }
    //             getAllMarks(function(err, items) { //获取浏览器书签
    //                 if (err) {
    //                     console.log('获取本地书签错误');
    //                     return;
    //                 }
    //                 console.log('本地书签：');
    //                 console.log(JSON.stringify(items[0].children[1]));
    //             });

    //         })

    //     }

    // });
});

/**
 * 从服务器下载数据
 */
function downAllData(userid, callback) {
    var marksData = {};
    console.error('开始下载数据');
    $.ajax({
        url: REMOTE_HOST + '/marks/getAll',
        type: 'get',
        data: { userid: userid },
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
            callback(null);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            callback(textStatus);
        }
    })

}