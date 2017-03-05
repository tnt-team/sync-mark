// chrome.bookmarks.getTree(function(bookmarkItems) {
//     $.ajax({
//         url: '127.0.0.1:5000/test',
//         type: 'post',
//         data: {
//             'items': JSON.stringify(bookmarkItems)
//         }
//     })
// });

// chrome.commands.onCommand.addListener(function(command) {
//     console.log('commands');
//     if (command === 'bookmarks') {
//         chrome.bookmarks.getTree(function(bookmarkItems) {
//             console.log(bookmarkItems);
//         });
//     }
// });

function debugBookmark() {
    console.log('debugBookmark');
    if (command === 'bookmarks') {
        chrome.bookmarks.getTree(function(bookmarkItems) {
            console.log(bookmarkItems);
        });
    }
}

chrome.browserAction.onClicked.addListener(debugBookmark);

