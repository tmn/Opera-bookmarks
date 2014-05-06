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

      for (var i = 0; i < results.length; i++) {
        if (results[i].url) {
          OB.create_popup_bookmark(results[i]);
        }
      }
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
chrome.bookmarks.getTree(function(bookmark_tree) {
  var tree  = bookmark_tree[0].children;

  // create the two main folder
  for (var i = 0; i < tree.length; i++) {
    OB.create_folder(tree[i]);
  }

  document.getElementById('add-bookmark-folders').selectedIndex = 0;
});

/* Get information from active tab
-------------------------------------------------------------------- */
chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
  current_page.id                            = tab[0].id;
  current_page.url                           = tab[0].url;
  current_page.title                         = tab[0].title;
  document.getElementById('title').innerHTML = current_page.title;
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

link_options.addEventListener('click', function (e) {
  e.preventDefault();
  Browser.createTab(link_options.dataset.site + ".html");
});

link_help.addEventListener('click', function (e) {
  e.preventDefault();
  Browser.createTab(link_help.dataset.site);
});
