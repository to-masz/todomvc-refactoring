/* global module */
'use strict';

function more() {
  var newObj = {};
  for (var i = 0; i < arguments.length; i++) {
    var obj = arguments[i];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
}

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.

function TodoModel(storage) {
  this.storage = storage;
  this.todos = this.storage.getTodos();
  this.onChanges = [];
}

TodoModel.prototype.subscribe = function(onChange) {
  this.onChanges.push(onChange);
};

TodoModel.prototype.inform = function() {
  this.storage.setTodos(this.todos);
  this.onChanges.forEach(function(cb) { cb(); });
};

TodoModel.prototype.toggleAll = function(checked) {
  // Note: it's usually better to use immutable data structures since they're
  // easier to reason about and React works very well with them. That's why
  // we use map() and filter() everywhere instead of mutating the array or
  // todo items themselves.
  this.todos = this.todos.map(function(todo) {
    return more({}, todo, {completed: checked});
  });

  this.inform();
};

TodoModel.prototype.toggle = function(todoToToggle) {
  this.todos = this.todos.map(function(todo) {
    return todo !== todoToToggle ?
      todo :
      more({}, todo, {completed: !todo.completed});
  });

  this.inform();
};

TodoModel.prototype.destroy = function(todo) {
  this.todos = this.todos.filter(function(candidate) {
    return candidate !== todo;
  });

  this.inform();
};

TodoModel.prototype.updateTodo = function(todoToUpdate, newText) {
  this.todos = this.todos.map(function(todo) {
    return todo !== todoToUpdate ? todo : more({}, todo, {title: newText});
  });

  this.inform();
};

TodoModel.prototype.clearCompleted = function() {
  this.todos = this.todos.filter(function(todo) {
    return !todo.completed;
  });

  this.inform();
};

TodoModel.prototype.addTodo = function(val) {
  var t = {id: '', title: val, completed: false};
  var random;
  for (var i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      t.id += '-';
    }
    t.id += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }

  this.todos = this.todos.concat(t);
  this.inform();
};

module.exports = TodoModel;
