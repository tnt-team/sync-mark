// 创建书签单击事件
document.getElementById('btn-create').addEventListener('click', function() {
    console.log('创建书签开始');
    var newmarks = browser.bookmarks.create({
        parentId: 'toolbar_____',
        title: '测试书签2',
        url: 'http://www.baidu.com'
    });
    console.log(newmarks);
    newmarks.then(function(node) {
        console.log('书签创建成功：' + node);
    }, function(err) {
        console.log('创建书签失败：' + err);

    });
});

// 删除书签
document.getElementById('btn-remove').addEventListener('click', function() {
    var id = 'QaWPXsvsVWXo';
    var delmarks = browser.bookmarks.remove(id);
    delmarks.then(function() {
        console.log('删除成功');
    }, function(err) {
        console.log(err);
    });
});

// 获取所有书签
document.getElementById('btn-getAll').addEventListener('click', function() {
    console.log('获取所有书签');
    var toolId = 'toolbar_____';
    var allmarks = browser.bookmarks.getChildren(toolId);
    allmarks.then(function(marks) {
        console.log(JSON.stringify(marks));

    }, function(err) {
        console.log('获取书签错误：' + err);
    });
});
