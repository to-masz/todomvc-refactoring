'use strict';
/* global React module require */
var TodoItems = require('./todo-items.js');

var TodoApp = React.createClass({

  render: function() {
    var props = this.props;
    var stats = props.stats;

    var model1 = this.props.model;
    var newField = this.refs.newField;

    function doun(event) {
      if (event.which !== 13) {
        return;
      } else {
        event.preventDefault();
        var val = newField.getDOMNode().value.trim();
        if (val) {
          var t = {id: '', title: val, completed: false};
          var random;
          for (var i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
              t.id += '-';
            }
            t.id += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
          }
          model1.todos = model1.todos.concat(t);
          model1.inform();

          newField.getDOMNode().value = '';
        }
      }
    }

    return (
      <div>
        <header id="header"><h1>todos</h1>
          <input ref="newField" id="new-todo" placeholder="What needs to be done?" onKeyDown={doun} autoFocus={true}/>
        </header>
        <TodoItems model={props.model} todos={props.todos} checked={stats.activeCount === 0}/>
        {this.props.stats.activeCount || this.props.stats.completedCount ? this.allDownThere() : (<footer></footer>)}
      </div>
    );
  },

  allDownThere: function() {
    var clear = this.props.stats.completedCount > 0 ?
      <button id="clear-completed" onClick={this.props.clearCompleted}>Clear completed
        ({this.props.stats.completedCount})</button> :
      <div></div>;

    return (
      <footer id="footer">
        <span
          id="todo-count"><strong>{this.props.stats.activeCount}</strong> {this.props.stats.activeCount === 1 ? 'item' : 'items'}
          left</span>
        <ul id="filters">{this.props.filters.map(function(data) {
          return (<li><a href={data.url} className={data.selected ? 'selected' : ''}>{data.linkText}</a></li>);
        })}
        </ul>
        {clear}</footer>
    );

  }
});

module.exports = TodoApp;
