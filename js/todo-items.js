'use strict';
/* global React module require */
var TodoItem = require('./todo-item.js');

var TodoItems = React.createClass({

  getInitialState: function() {
    return {
      editing: null
    };
  },

  toggleAll: function(event) {
    var checked = event.target.checked;
    this.props.model.toggleAll(checked);
  },

  edit: function(todo, callback) {
    this.setState({editing: todo.id}, function() {
      callback();
    });
  },

  save: function(todoToSave, text) {
    this.props.model.save(todoToSave, text);
    this.setState({editing: null});
  },

  cancel: function() {
    this.setState({editing: null});
  },

  render: function() {
    var model1 = this.props.model;
    var todos = this.props.todos;
    var self = this;

    function _renderItem(todo) {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={model1.toggle.bind(model1, todo)}
          onDestroy={model1.destroy.bind(model1, todo)}
          onEdit={self.edit.bind(self, todo)}
          editing={self.state.editing === todo.id}
          onSave={self.save.bind(self, todo)}
          onCancel={self.cancel}
          />
      );
    }

    return (
      <section id="main">
        <input id="toggle-all" type="checkbox" onChange={this.toggleAll} checked={this.props.checked}/>
        <ul id="todo-list">{todos.map(_renderItem)}</ul>
      </section>
    );
  }
});

module.exports = TodoItems;
