var SYNC_DOWN_DELAY = 0.1;
var SYNC_USER_NAME_ID = 'SYNC_USER_NAME_ID';
var SYNC_MARK_VERSION = 'SYNC_MARK_VERSION';

var REMOTE_HOST = 'http://localhost:3000'; //测试本地模拟远程服务器





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