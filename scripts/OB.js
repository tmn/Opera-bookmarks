window.OB = window.OB || {};

OB.utils = OB.utils || {};
OB.section = OB.seciton || {};


(function () {
  OB.active_index = 0;

  

  OB.delete_bookmark = function (id) {
    Utils.add_class('hidden', document.getElementById('mark_' + id));
    chrome.bookmarks.remove(id);
  };

  OB.exists = function (url) {
    chrome.bookmarks.search(url, function (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].url === url) {
          return true;
        }
      }

      return false;
    });
  };

  OB.save_bookmark = function () {
    var e = document.getElementById('add-bookmark-folders');

    if (!OB.exists(current_page.url)) {
      chrome.bookmarks.create({
        parentId: e.options[e.selectedIndex].value,
        title: document.getElementById('title').value,
        url: current_page.url
      });

      chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
        chrome.pageAction.setIcon({tabId:current_page.id, path:"media/bookmark_red.png"});
      });
    }

    window.close();
  };

  OB.search_bookmarks = function (string, callback) {
    chrome.bookmarks.search(string, function (results) {
      callback(results);
    });
  };

  OB.set_active_index = function (id) {
    var items    = document.getElementById('folder-view').childNodes;
    active_index = id;

    for (var i = 0; i < items.length; i++) {
      if (items[i].nodeName.toLowerCase() === 'li') {
        Utils.remove_class('active_folder', items[i]);
      }
    }

    Utils.add_class('active_folder', document.getElementById('folder_' + active_index));
  };

  OB.get_active_index  = function () {
    return this.active_index;
  };

})();
