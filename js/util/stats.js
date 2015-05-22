'use strict';
/* global module */

function stats(todos) {
  var activeCount = todos.filter(function(todo) { return !todo.completed; }).length;
  return {
    activeCount: activeCount,
    completedCount: todos.length - activeCount
  };
}

module.exports = stats;
