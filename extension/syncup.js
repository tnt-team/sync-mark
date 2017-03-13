QUEUE_DELAY = 500;

SYNC_ITEM_TYPES = {
  create: 'create',
  remove: 'remove',
  change: 'change',
  move: 'move',
  reorder: 'reorder'
}

function SyncUpItem(type, id, data) {
  this.id = id;
  this.type = type;
  this.bookmark;
  this.removeInfo;
  this.changeInfo;
  this.moveInfo;
  this.reorderInfo;

  switch(type) {
    case SYNC_ITEM_TYPES.create:
      this.bookmark = data;
      break;
    case SYNC_ITEM_TYPES.remove:
      this.removeInfo = data;
      break;
    case SYNC_ITEM_TYPES.change:
      this.changeInfo = data;
      break;
    case SYNC_ITEM_TYPES.move:
      this.moveInfo = data;
      break;
    case SYNC_ITEM_TYPES.reorder:
      this.reorderInfo = data;
      break;
  }
}
// SyncUpItem.prototype.valueOf = function() {
//   JSON.stringify(this);
// };

function SyncUpQueue(fn) {
  var that = this;
  var outputArr;
  var timeoutId;

  function delayCall() {
    console.log('delayCall: ');
    outputArr = that._syncUpDataArr;
    that._syncUpDataArr = [];
    fn(outputArr);
    timeoutId = undefined;
  }

  function makeDelayCall() {
    console.log('makeDelayCall: ');
    timeoutId = setTimeout(delayCall, QUEUE_DELAY);
  }

  this._syncUpDataArr = [];

  this.addSyncUp = function(syncUpItem) {
    console.log('addSyncUp: ' + syncUpItem.valueOf());
    that._syncUpDataArr.push(syncUpItem);
    // console.log(delayCall);
    if (timeoutId) {
      console.log('removeDelayCall: ');
      clearTimeout(timeoutId);
      makeDelayCall();
    } else {
      makeDelayCall();
    }
  }
}

var syncUpReq = function(syncUpItemArr) {
  console.log('syncUpReq: ' + syncUpItemArr.valueOf());
  syncTaskQueue.addSyncTask(function(taskFinish) {
    // $.ajax({
    //   url: '',
    //   data: {changes: JSON.stringify(syncUpItemArr)},
    //   dataType: "json",
    //   error: function() {
    //     // todo err
    //     // todo requeue
    //     taskFinish();
    //   },
    //   headers: { token: localStorage.token },
    //   timeout: 30000,
    //   type: 'POST',
    //   success: function() {
    //     // todo succ
    //     taskFinish();
    //   }
    // });
    console.log('todo request');
  });
}
var syncUpQueue = new SyncUpQueue(syncUpReq);
var syncUpWorker = {
  addSyncUp: function(type, id, data) {
    syncUpQueue.addSyncUp(new SyncUpItem(type, id, data));
  }
}

// var isImport = false;

browser.bookmarks.onCreated.addListener(function(id, bookmark) {
  console.log('bookmarks.onCreated');
  console.log(id);
  console.log(bookmark);
  if (bookmarkLock.isLocked) return;
  syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.create, id, bookmark);
});

browser.bookmarks.onRemoved.addListener(function(id, removeInfo) {
  // console.log('bookmarks.onRemoved');
  // console.log(id);
  // console.log(removeInfo);

  if (bookmarkLock.isLocked) return;
  syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.remove, id, removeInfo);
});

browser.bookmarks.onChanged.addListener(function(id, changeInfo) {
  // console.log('bookmarks.onChanged');
  // console.log(id);
  // console.log(changeInfo);

  if (bookmarkLock.isLocked) return;
  syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.change, id, changeInfo);
});

browser.bookmarks.onMoved.addListener(function(id, moveInfo) {
  // console.log('bookmarks.onMoved');
  // console.log(id);
  // console.log(moveInfo);

  if (bookmarkLock.isLocked) return;
  syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.move, id, moveInfo);
});

browser.bookmarks.onChildrenReordered.addListener(function(id, reorderInfo) {
  // console.log('bookmarks.onChildrenReordered');
  // console.log(id);
  // console.log(reorderInfo);

  if (bookmarkLock.isLocked) return;
  syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.reorder, id, reorderInfo);
});

// browser.bookmarks.onImportBegan.addListener(() => {
//   console.log('bookmarks.onImportBegan');
//   isImport = true;
// });

// browser.bookmarks.onImportEnded.addListener(() => {
//   console.log('bookmarks.onImportEnded');
//   isImport = false;
// });