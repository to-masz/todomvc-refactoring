/* global module */
'use strict';

function Filter(filters) {
  this._filters = filters;
  this._current = 0;
}

Filter.prototype = {
  applyOn: function(todos) {
    return this._filters[this._current].criteria ? todos.filter(this._filters[this._current].criteria) : todos;
  },

  getViewValues: function() {
    var currentIndex = this._current;
    return this._filters.map(function(by, idx) {
      return {url: '#' + by.url, linkText: by.linkText, selected: idx === currentIndex};
    });
  }
};

module.exports = Filter;
