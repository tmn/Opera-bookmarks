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
    var bookmark_list = document.querySelector('#right-content ul');
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
      a.setAttribute('target', '_blank');
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

  chrome.bookmarks.getTree(function (bookmarks) {
    fill_bookmark_folder_list(bookmarks);
  });

  var fill_bookmark_folder_list = function (bookmarks, parent_folder) {
    bookmarks.forEach(function (bookmark) {

      var parent = parent_folder || document.querySelector('#left-content ul');
      var li = null;

      if (bookmark.url === null || bookmark.url === undefined) {
        if (bookmark.title.length > 0) {

          li   = document.createElement('li');

          var button = document.createElement('button');

          button.setAttribute('data-index', bookmark.index);
          button.setAttribute('data-id', bookmark.id);
          button.setAttribute('id', 'folder_' + bookmark.id);
          button.setAttribute('class', 'btn btn-folder-bar');

          button.appendChild(document.createTextNode(bookmark.title));

          li.appendChild(button);
          li.addEventListener('click', folder_click);

          parent.appendChild(li);
        }
      }

      if (bookmark.children) {
        parent = li;
        fill_bookmark_folder_list(bookmark.children, parent);
      }
    });
  };



  /* INIT
  ----------------------------------------------------------------------------*/
  chrome.bookmarks.getChildren(active_folder, function (children) {
    update_bookmark_path_view();
    fill_bookmarks_view(children);
  });

  var modal_new_folder = document.getElementById('modal-new-folder')
  , modal_new_folder_box = document.getElementById('modal-new-folder-box')

  , btn_new_folder = document.getElementById('btn-new-folder')
  , input_new_folder = document.querySelector('#modal-new-folder-box input');


  /* Eventlisteners
  ----------------------------------------------------------------------------*/
  document.addEventListener('keyup', function (e) {
    if (e.keyCode == 27) {
      modal_new_folder.style.display = 'none';
    }
  }, false);

  modal_new_folder.addEventListener('click', function (e) {
    if (modal_new_folder.id == e.target.id) {
      this.style.display = 'none';
    }
  }, false);

  btn_new_folder.addEventListener('click', function () {
    input_new_folder.value = '';
    modal_new_folder.style.display = 'inline';
    input_new_folder.focus();
  }, false);

})();
