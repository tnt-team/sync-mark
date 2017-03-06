//创建定时任务
browser.alarms.create('sync', {
    periodInMinutes: 0.1
});

browser.alarms.onAlarm.addListener(function() {

    $.ajax({
        url: 'http://localhost:3000/marks/getAll/1',
        type: 'get',
        data: {},
        success: function(data) {
            console.log('success:' + data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('请求失败:' + JSON.stringify(XMLHttpRequest));
            console.log(textStatus);
        }
    });
});