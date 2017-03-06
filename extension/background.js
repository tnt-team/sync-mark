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


function makeIndent(indentLength) {
    return ".".repeat(indentLength);
}

function logItems(bookmarkItem, indent) {
    if (bookmarkItem.url) {
        console.log(makeIndent(indent) + bookmarkItem.url);
    } else {
        console.log(makeIndent(indent) + "Folder");
        indent++;
    }
    if (bookmarkItem.children) {
        for (child of bookmarkItem.children) {
            logItems(child, indent);
        }
    }
    indent--;
}

function logTree(bookmarkItems) {
    logItems(bookmarkItems[0], 0);
}

function onRejected(error) {
    console.log(`An error: ${error}`);
}

var gettingTree = browser.bookmarks.getTree();
gettingTree.then(logTree, onRejected);