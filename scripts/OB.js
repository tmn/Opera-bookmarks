window.OB = window.OB || {};

OB.utils = OB.utils || {};
OB.section = OB.seciton || {};


(function () {
  OB.active_index = 0;

  OB.section.POPUP = 0;
  OB.section.MANAGER = 1;

  OB.create_popup_bookmark = function (obj) {
    var txt
    , anchor = document.createElement('a')
    , item   = document.createElement('li')
    , img    = document.createElement('img')
    ;

    if (Browser.info.vendor == 'Opera') {
      img.setAttribute('src', 'opera://favicon/' + obj.url);
    }
    else {
      img.setAttribute('src', 'chrome://favicon/' + obj.url);
    }

    txt = obj.title.length > 0 ? obj.title : obj.url;
    txt = document.createTextNode(txt);


    anchor.setAttribute('href', obj.url);
    anchor.appendChild(txt);

    item.setAttribute('id', 'mark_' + obj.id);
    item.appendChild(img);
    item.appendChild(anchor);

    anchor.addEventListener('click', function() {
      chrome.tabs.create({url:obj.url});
    });

    document.querySelector('#search-result ul').appendChild(item);
  };


  OB.create_popup_folder = function (obj) {
    var txt  = document.createTextNode(obj.title)
    , option = document.createElement('option');

    option.setAttribute('data-id', obj.id);
    option.setAttribute('id', 'folder_' + obj.id);
    option.setAttribute('value', obj.id);
    option.appendChild(txt);

    document.getElementById('add-bookmark-folders').appendChild(option);
  };

  OB.create_manager_folder = function (obj) {
    var doc = document.createDocumentFragment();
    var li = document.createElement('li');
    li.setAttribute('data-id', obj.id);
    li.setAttribute('id', 'folder_' + obj.id);

    li.innerHTML = '<button class="btn btn-folder-bar">' + obj.title + '</button>';

    document.querySelector('#left-content ul').appendChild(li);
  };

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

  OB.get_folders = function (element) {
    var that = this;

    chrome.bookmarks.getTree(function(bookmark_tree) {
      var tree  = bookmark_tree[0].children;

      if (element == OB.section.POPUP) {
        // create the two main folder
        for (var i = 0; i < tree.length; i++) {
          that.create_popup_folder(tree[i]);
        }

        document.getElementById('add-bookmark-folders').selectedIndex = 0;
      }
      else if (element == OB.section.MANAGER) {
        for (var x in tree) {
          that.create_manager_folder(tree[x]);
        }
      }
    });
  };

  OB.get_children = function (id) {
    this.set_active_index(id);
    document.getElementById('bookmark-view').innerHTML = '';

    chrome.bookmarks.getChildren("" + id, function(children) {
      for (var i = 0; i < children.length; i++) {
        if (children[i].url) {
          this.create_bookmark(children[i]);
        }
      }
    });
  };

  OB.save_bookmark = function () {
    var e = document.getElementById('add-bookmark-folders');

    if (!OB.exists(current_page.url)) {
      chrome.bookmarks.create({parentId:e.options[e.selectedIndex].value, title:document.getElementById('title').innerHTML, url:current_page.url});


      chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
        chrome.pageAction.setIcon({tabId:current_page.id, path:"media/bookmark_red.png"});
      });
    }

    window.close();
  };

  OB.search_bookmarks = function (string, callback) {
    var that = this;
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
