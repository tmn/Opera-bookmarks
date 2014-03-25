function checkURL(tabID, changeInfo, tab) {
  chrome.pageAction.show(tabID);

  chrome.bookmarks.search(tab.url, function (nodes) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].url === tab.url) {
        chrome.pageAction.setIcon({tabId:tabID, path:"media/bookmark_red.png"});
      }
    }
  });
}

chrome.tabs.onUpdated.addListener(checkURL);

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
});
