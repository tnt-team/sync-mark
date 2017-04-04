console.log('syncup init begin');

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

/**
 * this queue combine lots of same bookmark creating and removing request in a short time into one, 
 * meanwhile, it combine operations by same item in a short time into one.
 * @param {Function} fn 
 */
function SyncUpQueue(fn) {
  var that = this;
  var outputArr;
  var outputType;
  var lastItem;
  var timeoutId;

  function syncCall() {
    console.log('syncCall: ');
    outputArr = that._syncUpDataArr;
    that._syncUpDataArr = [];
    fn(outputArr, outputType);
    timeoutId = undefined;
  }

  function makeDelayCall() {
    console.log('makeDelayCall: ');
    timeoutId = setTimeout(syncCall, QUEUE_DELAY);
  }

  this._syncUpDataArr = [];

  this.addSyncUp = function(syncUpItem) {
    console.log('addSyncUp: ' + syncUpItem.valueOf());
    if (timeoutId) {
      console.log('removeDelayCall: ');
      clearTimeout(timeoutId);
    }
    // not the first request, check last request item whether same with current or not
    if (lastItem && lastItem.id === syncUpItem.id) {
      // if queue has more than one member, then execute previous items and queue the current item.
      if (that._syncUpDataArr.length > 1) {
        that._syncUpDataArr.pop();
        // clearTimeout(timeoutId);
        syncCall();
        console.log('create item bonus: ');
        that._syncUpDataArr.push(lastItem);
      }
      // the situation that member was initinally created and finially removed, that was equals nothing.
      if (lastItem.type === SYNC_ITEM_TYPES.create && syncUpItem.type === SYNC_ITEM_TYPES.remove) {
        outputType = null;
        lastItem = null;
        that._syncUpDataArr = [];
      }
      // move operations just update item index and parentId
      else if (syncUpItem.type === SYNC_ITEM_TYPES.move) {
        lastItem.index = syncUpItem.changeInfo.index;
        lastItem.parentId = syncUpItem.changeInfo.parentId;
      }
      // change values
      else if (syncUpItem.type === SYNC_ITEM_TYPES.change) {
        Object.keys(syncUpItem.changeInfo).forEach(function(pk) {
          if (pk === 'id') return;
          lastItem[pk] = syncUpItem.changeInfo[pk];
        });
      }
      // todo syncUpItem.type === SYNC_ITEM_TYPES.reorder

      // wait for a few millseconds
      makeDelayCall();
    }
    // not the first request, and not same request item
    else if (lastItem && lastItem.id !== SyncUpItem.id) {
      //check whether request type is same or not
      if (lastItem.type === SYNC_ITEM_TYPES.create || lastItem.type === SYNC_ITEM_TYPES.remove) {
        if (syncUpItem.type === outputType) {
          that._syncUpDataArr.push(syncUpItem);
          lastItem = syncUpItem;
          makeDelayCall();
        }
        else if (syncUpItem.type === SYNC_ITEM_TYPES.create || syncUpItem.type === SYNC_ITEM_TYPES.remove) {
          console.log('change item req queue: ');
          syncCall();
          that._syncUpDataArr.push(syncUpItem);
          outputType = syncUpItem.type;
          lastItem = syncUpItem;
          makeDelayCall();
        }
        else {
          console.log('single item req: ');
          syncCall();
          that._syncUpDataArr.push(syncUpItem);
          outputType = SYNC_ITEM_TYPES.change;
          lastItem = syncUpItem;
          syncCall();
        }
      } 
      else {
        if (syncUpItem.type === SYNC_ITEM_TYPES.create || syncUpItem.type === SYNC_ITEM_TYPES.remove) {
          console.log('single item req: ');
          syncCall();
          that._syncUpDataArr.push(syncUpItem);
          outputType = syncUpItem.type;
          lastItem = syncUpItem;
          makeDelayCall();
        }
        else {
          console.log('continue single item req: ');
          syncCall();
          that._syncUpDataArr.push(syncUpItem);
          outputType = SYNC_ITEM_TYPES.change;
          lastItem = syncUpItem;
          syncCall();
        }
      }
    }
    // first request
    else {
      that._syncUpDataArr.push(syncUpItem);
      
      if (syncUpItem.type === SYNC_ITEM_TYPES.create || syncUpItem.type === SYNC_ITEM_TYPES.remove) {
        outputType = syncUpItem.type;
      } 
      // change, move, reorder convert to change
      else {
        outputType = SYNC_ITEM_TYPES.change
      }
      lastItem = syncUpItem;
      makeDelayCall();
    }
  }
}

var syncUpReq = function(syncUpItemArr, outputType) {
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
  // console.log(id);
  console.log(bookmark);
  if (bookmarkLock.isLocked) return;
  syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.create, id, bookmark);
});

browser.bookmarks.onRemoved.addListener(function(id, removeInfo) {
  console.log('bookmarks.onRemoved');
  // console.log(id);
  removeInfo.id = id;
  console.log(removeInfo);
  if (bookmarkLock.isLocked) return;
  syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.remove, id, removeInfo);
});

browser.bookmarks.onChanged.addListener(function(id, changeInfo) {
  console.log('bookmarks.onChanged');
  // console.log(id);
  changeInfo.id = id;
  console.log(changeInfo);

  if (bookmarkLock.isLocked) return;
  syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.change, id, changeInfo);
});

browser.bookmarks.onMoved.addListener(function(id, moveInfo) {
  console.log('bookmarks.onMoved');
  // console.log(id);
  moveInfo.id = id;
  console.log(moveInfo);

  if (bookmarkLock.isLocked) return;
  syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.move, id, moveInfo);
});

// browser.bookmarks.onChildrenReordered && browser.bookmarks.onChildrenReordered.addListener(function(id, reorderInfo) {
//   console.log('bookmarks.onChildrenReordered');
//   console.log(id);
//   console.log(reorderInfo);

//   if (bookmarkLock.isLocked) return;
//   syncUpWorker.addSyncUp(SYNC_ITEM_TYPES.reorder, id, reorderInfo);
// });

// browser.bookmarks.onImportBegan && browser.bookmarks.onImportBegan.addListener(() => {
//   console.log('bookmarks.onImportBegan');
//   isImport = true;
// });

// browser.bookmarks.onImportEnded && browser.bookmarks.onImportEnded.addListener(() => {
//   console.log('bookmarks.onImportEnded');
//   isImport = false;
// });

console.log('syncup init end');