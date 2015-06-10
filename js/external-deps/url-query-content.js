'use strict';
/* global module window */

function UrlQueryContent() {
  this.name = '';
}
UrlQueryContent.prototype = {
  get: function() {
    var parts = window.location.search.split(this.name + '=');
    if (parts.length === 2) {
      return decodeURIComponent(parts[1]);
    }
    return '';
  },
  set: function(value) {
    var hash = window.location.hash;
    window.history.pushState({}, null, '?' + this.name + '=' + encodeURIComponent(value) + hash);
  }
};
UrlQueryContent.fromParameter = function(name) {
  var content = new UrlQueryContent();
  content.name = name;
  return content;
};

module.exports = UrlQueryContent;
