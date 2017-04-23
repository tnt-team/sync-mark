$(function() {
    $('#login').on('click', function() {
        var creating = browser.tabs.create({
            active: true,
            index: 0,
            url: syncmark.remoteHost + '/login'
        });
        creating.then(function(error) {

        }, function(data) {
            console.log(data);
        });
    });

    $('#register').on('click', function() {
        var createing = browser.tabs.create({
            active: true,
            index: 0, //新页面位置
            url: syncmark.remoteHost + '/register'
        });

    });



});