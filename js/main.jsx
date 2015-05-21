'use strict';
/* global React Router */
var app = {};
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
// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
app.TodoModel = function(key) {
  this.key = key;
  this.todos = (localStorage.getItem(key) && JSON.parse(localStorage.getItem(key))) || [];
  this.onChanges = [];
};

app.TodoModel.prototype.subscribe = function(onChange) {
  this.onChanges.push(onChange);
};

app.TodoModel.prototype.inform = function() {
  localStorage.setItem(this.key, JSON.stringify(this.todos));
  this.onChanges.forEach(function(cb) { cb(); });
};

app.TodoModel.prototype.toggleAll = function(checked) {
  // Note: it's usually better to use immutable data structures since they're
  // easier to reason about and React works very well with them. That's why
  // we use map() and filter() everywhere instead of mutating the array or
  // todo items themselves.
  this.todos = this.todos.map(function(todo) {
    return more({}, todo, {completed: checked});
  });

  this.inform();
};

app.TodoModel.prototype.toggle = function(todoToToggle) {
  this.todos = this.todos.map(function(todo) {
    return todo !== todoToToggle ?
      todo :
      more({}, todo, {completed: !todo.completed});
  });

  this.inform();
};

app.TodoModel.prototype.destroy = function(todo) {
  this.todos = this.todos.filter(function(candidate) {
    return candidate !== todo;
  });

  this.inform();
};

app.TodoModel.prototype.save = function(todoToSave, text) {
  this.todos = this.todos.map(function(todo) {
    return todo !== todoToSave ? todo : more({}, todo, {title: text});
  });

  this.inform();
};

app.TodoModel.prototype.clearCompleted = function() {
  this.todos = this.todos.filter(function(todo) {
    return !todo.completed;
  });

  this.inform();
};

app.TodoItem = React.createClass({
  sbmt: function() {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({editText: val});
    } else {
      this.props.onDestroy();
    }
  },

  dblclk: function() {
    this.props.onEdit(function() {
      var node = this.refs.editField.getDOMNode();
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }.bind(this));
    this.setState({editText: this.props.todo.title});
  },

  doun: function(event) {
    if (event.which === 27) {
      this.setState({editText: this.props.todo.title});
      this.props.onCancel(event);
    } else if (event.which === 13) {
      this.sbmt(event);
    }
  },

  handleChange: function(event) {
    this.setState({editText: event.target.value});
  },

  getInitialState: function() {
    return {editText: this.props.todo.title};
  },

  render: function() {
    return (
      <li className={React.addons.classSet({
        completed: this.props.todo.completed,
        editing: this.props.editing
      })}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={this.props.todo.completed} onChange={this.props.onToggle}/>
          <label onDoubleClick={this.dblclk}>{this.props.todo.title}</label>
          <button className="destroy" onClick={this.props.onDestroy}/>
        </div>
        <input ref="editField" className="edit" value={this.state.editText} onBlur={this.sbmt}
               onChange={this.handleChange} onKeyDown={this.doun}/>
      </li>
    );
  }
});

app.TodoItems = React.createClass({

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
        <app.TodoItem
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

var filterData = [
  {url: '/', linkText: 'All'},
  {url: '/active', linkText: 'Active', criteria: function(todo) { return !todo.completed; }},
  {url: '/completed', linkText: 'Completed', criteria: function(todo) { return todo.completed; }}
];
var filter = new Filter(filterData);

function updateViewFilteredBy(index) {
  filter._current = index;
  updateView();
}

function getStats(todos) {
  var activeCount = todos.filter(function(todo) { return !todo.completed; }).length;
  return {
    activeCount: activeCount,
    completedCount: todos.length - activeCount
  };
}

var todoApp;
function updateView() {
  todoApp.setProps({
    model: model,
    todos: filter.applyOn(model.todos),
    filters: filter.getViewValues(),
    stats: getStats(model.todos)
  });
}

app.TodoApp = React.createClass({

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
        <app.TodoItems model={props.model} todos={props.todos} checked={stats.activeCount === 0}/>
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

var model = new app.TodoModel('react-todos');
model.subscribe(updateView);
todoApp = React.render(
  <app.TodoApp
    model={model}
    todos={model.todos}
    filters={filter.getViewValues()}
    stats={getStats(model.todos)}
    clearCompleted={model.clearCompleted.bind(model)}
    />,
  document.getElementById('todoapp')
);
var routerData = {};
filterData.forEach(function(f, idx) {
  routerData[f.url] = updateViewFilteredBy.bind(null, idx);
});
var router = new Router(routerData);
router.init(filterData[0].url);
