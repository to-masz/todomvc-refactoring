'use strict';
/* global localStorage module */

function LocalStorage(key) {
  this.getTodos = function() {
    return (localStorage.getItem(key) && JSON.parse(localStorage.getItem(key))) || [];
  };
  this.setTodos = function(todos) {
    localStorage.setItem(key, JSON.stringify(todos));
  };
}

module.exports = LocalStorage;
