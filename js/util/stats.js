'use strict';
/* global module */

function stats(todos) {
  var activeCount = todos.filter(isActive).length;
  return {
    activeCount: activeCount,
    completedCount: todos.length - activeCount
  };
}

function isActive(todo) {
  return !todo.completed;
}

module.exports = stats;
