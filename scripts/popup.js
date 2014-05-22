/* DOM Elements
-------------------------------------------------------------------- */
var save_button   = document.getElementById('ui-save')
, cancel_button   = document.getElementById('cancel')
, search_field    = document.getElementById('search-field')
, bookmark_edit   = document.getElementById('boookmark-edit')
, options_button  = document.getElementById('options-button');

/* Values
-------------------------------------------------------------------- */
var debug         = 0;

var current_page = {
  title: '',
  url: '',
  id: ''
};

/* Event listeners
-------------------------------------------------------------------- */
save_button.addEventListener('click', function (e) {
  OB.save_bookmark();
});

cancel_button.addEventListener('click', function (e) {
  window.close();
});

search_field.addEventListener('keyup', function(e) {
  if (search_field.value.length > 0) {
    OB.search_bookmarks(search_field.value, function (results) {
      document.querySelector('#search-result ul').innerHTML = '';

      results.forEach(function (result) {
        if (result.url) {
          var txt
          , anchor = document.createElement('a')
          , item   = document.createElement('li')
          , img    = document.createElement('img')
          ;

          if (Browser.info.vendor == 'Opera') {
            img.setAttribute('src', 'opera://favicon/' + result.url);
          }
          else {
            img.setAttribute('src', 'chrome://favicon/' + result.url);
          }

          txt = result.title.length > 0 ? result.title : result.url;
          txt = document.createTextNode(txt);


          anchor.setAttribute('href', result.url);
          anchor.appendChild(txt);

          item.setAttribute('id', 'mark_' + result.id);
          item.appendChild(img);
          item.appendChild(anchor);

          anchor.addEventListener('click', function() {
            chrome.tabs.create({url:result.url});
          });

          document.querySelector('#search-result ul').appendChild(item);
        }
      });
    });

    Utils.remove_class('hidden', document.getElementById('search-result'));
  }
  else {
    // OB.get_children(active_index);
    Utils.add_class('hidden', document.getElementById('search-result'));
  }
});

/* Fill inn root folders
-------------------------------------------------------------------- */
// OB.get_folders(OB.section.POPUP);
var fill_folder_selection_list = function (bookmarks, parent_folder, step) {
  step = step || 0;

  bookmarks.forEach(function (bookmark) {
    var parent = parent_folder || document.querySelector('#left-content ul');
    var li = null;
    var steps = step;

    if (bookmark.url === null || bookmark.url === undefined) {
      console.log(bookmark);
      if (bookmark.title.length > 0) {

        var txt  = document.createTextNode(new Array(steps).join('-') + ' ' + bookmark.title)
        , option = document.createElement('option');

        option.setAttribute('data-id', bookmark.id);
        option.setAttribute('id', 'folder_' + bookmark.id);
        option.setAttribute('value', bookmark.id);
        option.appendChild(txt);

        document.getElementById('add-bookmark-folders').appendChild(option);
      }
    }

    document.getElementById('add-bookmark-folders').selectedIndex = 0;

    if (bookmark.children) {
      parent = li;
      fill_folder_selection_list(bookmark.children, parent, ++steps);
    }
  });
};

chrome.bookmarks.getTree(function (bookmarks) {
  console.log('asdf');
  fill_folder_selection_list(bookmarks);
});

/* Get information from active tab
-------------------------------------------------------------------- */
chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
  current_page.id                            = tab[0].id;
  current_page.url                           = tab[0].url;
  current_page.title                         = tab[0].title;
  document.getElementById('title').value     = current_page.title;
});

/* Tabs
-------------------------------------------------------------------- */
var link_manager = document.getElementById('link-manager')
, link_options   = document.getElementById('link-options')
, link_help      = document.getElementById('link-help');

link_manager.addEventListener('click', function (e) {
  e.preventDefault();
  Browser.createTab(link_manager.dataset.site + ".html");
});

// link_options.addEventListener('click', function (e) {
//   e.preventDefault();
//   Browser.createTab(link_options.dataset.site + ".html");
// });

link_help.addEventListener('click', function (e) {
  e.preventDefault();
  Browser.createTab(link_help.dataset.site);
});
