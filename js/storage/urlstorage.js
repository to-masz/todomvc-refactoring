'use strict';
/* global JSON module require */

var UrlQueryContent = require('../external-deps/url-query-content');

function UrlStorage(urlQueryContent) {
  if (!urlQueryContent) {
    urlQueryContent = UrlQueryContent.fromParameter('todos');
  }
  this.getTodos = function() {
    try {
      return JSON.parse(urlQueryContent.get());
    } catch (e) {
      var noData = [];
      return noData;
    }
  };
  this.setTodos = function(todos) {
    urlQueryContent.set(JSON.stringify(todos));
  };
}

module.exports = UrlStorage;
