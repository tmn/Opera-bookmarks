OB = window.OB || {};

(function () {
  var active_folder = '1';

  var update_bookmark_path_view = function () {
    var bookmark_path = document.getElementById('bookmark-path');

    chrome.bookmarks.get(active_folder, function (folder) {
      bookmark_path.innerHTML = folder[0].title;
    });
  };

  var fill_bookmarks_view = function (bookmarks) {
    var bookmark_list = document.querySelector('#right-content div ul');
    bookmark_list.innerHTML = '';

    if (bookmarks.length === 0) {
      bookmark_list.innerHTML = '<li>No bookmarks found</li>';
      return;
    }

    for (var i in bookmarks) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      var img = document.createElement('img');

      img.setAttribute('src', Browser.info.vendor + '://favicon/' + bookmarks[i].url);
      a.setAttribute('href', bookmarks[i].url);
      a.appendChild(document.createTextNode(bookmarks[i].title));

      li.appendChild(img);
      li.appendChild(a);

      bookmark_list.appendChild(li);
    }
  };

  var folder_click = function (e) {
    active_folder = e.target.dataset.id + '';

    update_bookmark_path_view();

    chrome.bookmarks.getChildren(e.target.dataset.id, function (children) {
      fill_bookmarks_view(children);
    });
  };

  OB.get_folders(OB.section.MANAGER, function (tree) {
    for (var t in tree) {
      var li   = document.createElement('li')
      , button = document.createElement('button');

      button.setAttribute('data-index', tree[t].index);
      button.setAttribute('data-id', tree[t].id);
      button.setAttribute('id', 'folder_' + tree[t].id);
      button.setAttribute('class', 'btn btn-folder-bar');

      button.appendChild(document.createTextNode(tree[t].title));

      li.appendChild(button);
      li.addEventListener('click', folder_click);

      document.querySelector('#left-content ul').appendChild(li);
    }
  });


  /* INIT
  ----------------------------------------------------------------------------*/

  chrome.bookmarks.getChildren(active_folder, function (children) {
    update_bookmark_path_view();
    fill_bookmarks_view(children);
  });

})();
