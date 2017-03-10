// import CONFIG from './profile'
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
SyncUpItem.prototype.valueOf = function() {
  JSON.stringify(this);
};

function SyncUpQueue(fn) {
  var that = this;
  var outputArr;
  var delayCall;

  function makeDelayCall() {
    delayCall = function() {
      outputArr = that._syncUpDataArr;
      that._syncUpDataArr = [];
      fn(outputArr);
    }
    setTimeout(delayCall, QUEUE_DELAY);
  }

  this._syncUpDataArr = [];

  this.addSyncUp = function(syncUpItem) {
    that._syncUpDataArr.push(syncUpItem);
    if (delayCall) {
      clearTimeout(delayCall);
      makeDelayCall();
    }
  }
  this.startSyncUp = function() {
    makeDelayCall();
  }
}

var syncUpReq = function(syncUpItemArr) {
  $.ajax({
    url: '',
    data: {changes: syncUpItemArr},
    dataType: "json",
    error: function() {
      // todo err
      // todo requeue
    },
    headers: { token: localStorage.token },
    timeout: 30000,
    type: 'POST',
    success: function() {
      // todo succ
    }
  });
}
var syncUpWorker = {

}

// console.log(CONFIG.host);
console.log('syncup');
var isImport = false;

browser.bookmarks.onCreated.addListener((id, bookmark) => {
  console.log('bookmarks.onCreated');
  // console.log(id);
  // console.log(bookmark);
});

browser.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log('bookmarks.onRemoved');
  console.log(id);
  console.log(removeInfo);
});

browser.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log('bookmarks.onChanged');
  console.log(id);
  console.log(changeInfo);
});

browser.bookmarks.onMoved.addListener((id, moveInfo) => {
  console.log('bookmarks.onMoved');
  console.log(id);
  console.log(moveInfo);
});

browser.bookmarks.onChildrenReordered.addListener((id, reorderInfo) => {
  console.log('bookmarks.onChildrenReordered');
  console.log(id);
  console.log(reorderInfo);
});

browser.bookmarks.onImportBegan.addListener(() => {
  console.log('bookmarks.onImportBegan');
  isImport = true;
});

browser.bookmarks.onImportEnded.addListener(() => {
  console.log('bookmarks.onImportEnded');
  isImport = false;
});