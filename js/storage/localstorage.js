'use strict';
/* global localStorage module */

function LocalStorage(key) {
  this.get = function() {
    return (localStorage.getItem(key) && JSON.parse(localStorage.getItem(key))) || [];
  };
  this.set = function(todos) {
    localStorage.setItem(key, JSON.stringify(todos));
  };
}

module.exports = LocalStorage;
