'use strict';
/* global JSON module require */

var UrlQueryContent = require('../external-deps/url-query-content');

function UrlStorage(urlQueryContent) {
  this.urlQueryContent = urlQueryContent || UrlQueryContent.fromParameter('todos');
}
UrlStorage.prototype = {
  getTodos: function() {
    try {
      return JSON.parse(this.urlQueryContent.get());
    } catch (e) {
      var noTodos = [];
      return noTodos;
    }
  },

  setTodos: function(todos) {
    this.urlQueryContent.set(JSON.stringify(todos));
  }

};

module.exports = UrlStorage;
