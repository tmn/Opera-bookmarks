OB = window.OB || {};

(function () {
  var active_folder = '1';

  var modal_new_folder = document.getElementById('modal-new-folder')
  , modal_new_folder_box = document.getElementById('modal-new-folder-box')

  , btn_new_folder = document.getElementById('btn-new-folder')
  , left_folder_list = document.querySelector('#left-content ul')
  , modal_new_folder_input = document.querySelector('#modal-new-folder-box input')
  , modal_new_folder_select = document.getElementById('modal-new-folder-select')
  , modal_new_folder_create = document.getElementById('modal-new-folder-create')
  , modal_new_folder_cancel = document.getElementById('modal-new-folder-cancel')
  , context_menu_left = document.getElementById('context-menu-left')
  , context_menu_delete = document.getElementById('context-menu-delete')
  , context_menu_rename = document.getElementById('context-menu-rename');

  var context_menu_left_active_id = -1;

  var create_folder = function () {
    var name = (modal_new_folder_input.value.length === 0) ? 'New folder' : modal_new_folder_input.value;

    chrome.bookmarks.create({
      parentId: modal_new_folder_select.value,
      title: name
    });

    refresh_folder_view();
  };

  var refresh_folder_view = function () {
    document.querySelector('#left-content ul').innerHTML = '';
    modal_new_folder_select.innerHTML = '';

    chrome.bookmarks.getTree(function (bookmarks) {
      fill_bookmark_folder_list(bookmarks);
      fill_new_folder_list(bookmarks);
    });
  };

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

    bookmarks.forEach(function (bookmark) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      var img = document.createElement('img');

      img.setAttribute('src', Browser.info.vendor + '://favicon/' + bookmark.url);
      a.setAttribute('href', bookmark.url);
      a.setAttribute('target', '_blank');
      a.appendChild(document.createTextNode(bookmark.title));

      li.appendChild(img);
      li.appendChild(a);

      if (bookmark.url === null || bookmark.url === undefined) {
        img.setAttribute('src', '/media/folder.png');
        a.setAttribute('data-id', bookmark.id);
        a.addEventListener('click', folder_click);
        bookmark_list.insertBefore(li, bookmark_list.children[0]);
      }
      else {
        bookmark_list.appendChild(li);
      }
    });

  };

  var folder_click = function (e) {
    e.preventDefault();

    active_folder = e.target.dataset.id + '';

    update_bookmark_path_view();

    chrome.bookmarks.getChildren(e.target.dataset.id, function (children) {
      fill_bookmarks_view(children);
    });
  };

  chrome.bookmarks.getTree(function (bookmarks) {
    document.querySelector('#left-content ul').innerHTML = '';
    fill_bookmark_folder_list(bookmarks);
    fill_new_folder_list(bookmarks);
  });

  var fill_bookmark_folder_list = function (bookmarks, parent_folder, step) {
    step = step || 0;

    bookmarks.forEach(function (bookmark) {
      var parent = parent_folder || document.querySelector('#left-content ul');
      var li = null;
      var steps = step;

      if (bookmark.url === null || bookmark.url === undefined) {
        if (bookmark.title.length > 0) {

          li   = document.createElement('li');

          var button = document.createElement('button');

          button.setAttribute('data-index', bookmark.index);
          button.setAttribute('data-id', bookmark.id);
          button.setAttribute('id', 'folder_' + bookmark.id);
          button.setAttribute('class', 'btn btn-folder-bar');

          button.appendChild(document.createTextNode(new Array(steps).join('-') + ' ' + bookmark.title));

          li.appendChild(button);
          li.addEventListener('click', folder_click);

          parent.appendChild(li);
        }
      }

      if (bookmark.children) {
        parent = li;
        fill_bookmark_folder_list(bookmark.children, parent, ++steps);
      }
    });
  };

  var fill_new_folder_list = function (bookmarks, parent_folder, step) {
    step = step || 0;

    bookmarks.forEach(function (bookmark) {
      var parent = parent_folder || document.querySelector('#left-content ul');
      var li = null;
      var steps = step;

      if (bookmark.url === null || bookmark.url === undefined) {
        if (bookmark.title.length > 0) {
          var txt  = document.createTextNode(new Array(steps).join('-') + ' ' + bookmark.title)
          , option = document.createElement('option');

          option.setAttribute('data-id', bookmark.id);
          option.setAttribute('id', 'folder_' + bookmark.id);
          option.setAttribute('value', bookmark.id);
          option.appendChild(txt);

          modal_new_folder_select.appendChild(option);
        }
      }

      if (bookmark.children) {
        parent = li;
        fill_new_folder_list(bookmark.children, parent, ++steps);
      }
    });
  };


  /* INIT
  ----------------------------------------------------------------------------*/
  chrome.bookmarks.getChildren(active_folder, function (children) {
    update_bookmark_path_view();
    fill_bookmarks_view(children);
  });

  /* Eventlisteners
  ----------------------------------------------------------------------------*/
  document.addEventListener('keyup', function (e) {
    if (e.keyCode == 27) {
      modal_new_folder.style.display = 'none';
      context_menu_left.style.display = 'none';
    }
  }, false);

  document.addEventListener('click', function (e) {
    context_menu_left.style.display = 'none';
  }, false);



  left_folder_list.addEventListener('contextmenu', function (e) {
    context_menu_left_active_id = e.target.dataset.id;

    context_menu_left.style.left = window.event.clientX + 'px';
    context_menu_left.style.top = window.event.clientY + 'px';
    context_menu_left.style.display = 'inline';

    window.event.returnValue = false;
  });

  context_menu_delete.addEventListener('click', function (e) {
    chrome.bookmarks.remove(context_menu_left_active_id, function () {
      refresh_folder_view();
    });
  }, false);

  modal_new_folder_input.addEventListener('keyup', function (e) {
    if (e.keyCode == 13) {
      create_folder();
      modal_new_folder.style.display = 'none';
    }
  });

  modal_new_folder.addEventListener('click', function (e) {
    if (modal_new_folder.id == e.target.id) {
      this.style.display = 'none';
    }
  }, false);

  btn_new_folder.addEventListener('click', function (e) {
    modal_new_folder_input.value = '';
    modal_new_folder.style.display = 'inline';
    modal_new_folder_input.focus();
  }, false);

  modal_new_folder_create.addEventListener('click', function (e) {
    create_folder();
    modal_new_folder.style.display = 'none';
  });

  modal_new_folder_cancel.addEventListener('click', function (e) {
    modal_new_folder.style.display = 'none';
  });

})();
