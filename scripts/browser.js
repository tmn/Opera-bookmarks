window.Browser = window.Browser || {};

(function () {
  Browser.info = {};

  Browser.info.vendor = null;

  if (navigator.userAgent.indexOf('OPR') > -1) {
    Browser.info.vendor = 'Opera';
  }
  else if (navigator.userAgent.indexOf('Chrome') > -1) {
    Browser.info.vendor = 'Chrome';
  }

  Browser.validate = function () {
    return Browser.info.vendor == 'Opera' || Browser.info.vendor == 'Chrome';
  };

  Browser.createTab = function (url) {
    if (!Browser.validate()) return;

    if (chrome.tabs) {
      chrome.tabs.create({url: url, selected: true});
    }
  };

})();
