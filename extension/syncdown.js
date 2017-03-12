localStorage.setItem(SYNC_USER_NAME_ID, 1); //模拟用户登录
localStorage.setItem(SYNC_MARK_VERSION, 0); //模拟版本号

//创建定时任务
browser.alarms.create('sync', {
    periodInMinutes: SYNC_DOWN_DELAY
        // delayInMinutes: SYNC_DOWN_DELAY
});


// 监听定时任务，目前每SYNC_DOWN_DELAY秒触发一次，从服务器同步数据
browser.alarms.onAlarm.addListener(function() {
    var userid = localStorage.getItem(SYNC_USER_NAME_ID);
    if (!userid) {
        console.log('用户未登陆');
        browser.alarms.clear('sync');
        return;
    }
    var version = localStorage.getItem(SYNC_MARK_VERSION);
    // version=

    $.ajax({
        url: REMOTE_HOST + '/users/getVersion',
        type: 'get',
        data: { userid: userid },
        success: function(data) {
            if (data.error) {
                console.error('获取版本号失败');
                return;
            }
            var curVersion = data.result[0].version;
            console.log(JSON.stringify('result:' + JSON.stringify(curVersion)));

            if (!curVersion) {
                console.error(curVersion);
                //TODO 本地比服务器的新 待处理
            }
            if (curVersion > version) { //服务器的版本较新
                var data = downData(userid); //服务器数据
                getAllMarks(function(err, items) {
                    if (err) {
                        console.log('获取本地书签错误');
                        return;
                    }
                    console.log('本地书签：')
                    console.log(JSON.stringify(items[0].children[1]));
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('请求失败:' + JSON.stringify(XMLHttpRequest));
            console.log(textStatus);
        }
    });
});

/**
 * 从服务器下载数据
 */
function downData(userid) {
    var marksData = {};
    console.error('开始下载数据');
    $.get(REMOTE_HOST + '/marks/getAll', { userid: userid }, function(data) {
        marksData = data.result;
        console.log(marksData);
    });
    return marksData;
}