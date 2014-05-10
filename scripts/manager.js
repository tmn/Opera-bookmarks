OB = window.OB || {};

(function () {
  OB.get_folders(OB.section.MANAGER, function (tree) {
    for (var t in tree) {
      var doc = document.createDocumentFragment();
      var li = document.createElement('li');
      li.setAttribute('data-id', tree[t].id);
      li.setAttribute('id', 'folder_' + tree[t].id);

      li.innerHTML = '<button class="btn btn-folder-bar">' + tree[t].title + '</button>';

      document.querySelector('#left-content ul').appendChild(li);
    }
  });
})();
