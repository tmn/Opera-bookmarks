var Utils = window.Utils || {};

(function() {

  Utils.add_class = function ( classname, element ) {
    var cn = element.className;
    if (this.has_class(classname, element)) {
      return;
    }

    if (cn !== '') {
      classname = ' ' + classname;
    }

    element.className = cn + classname;
  };

  Utils.remove_class = function (classname, element) {
    var cn    = element.className;
    var rxp   = new RegExp("\\s?\\b" + classname + "\\b", "g");
    cn        = cn.replace( rxp, '' );

    element.className = cn;
  };

  Utils.has_class = function (classname, element) {
    var cn = element.className;
    var rxp = new RegExp( "\\s?\\b" + classname + "\\b", "g" );
    if (cn.match(rxp) !== null) {
      return true;
    }

    return false;
  };

})();
