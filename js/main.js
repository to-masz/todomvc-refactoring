'use strict';
/* global React Router require */
var Filter = require('./filter.js');
var TodoModel = require('./todo-model.js');
var TodoApp = require('./app.js');
var getStats = require('./util/stats.js');
var LocalStorage = require('./storage/localstorage.js');

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

var todoApp;
function updateView() {
  todoApp.setProps({
    model: model,
    todos: filter.applyOn(model.todos),
    filters: filter.getViewValues(),
    stats: getStats(model.todos)
  });
}

var storage = new LocalStorage('react-todos');
var model = new TodoModel(storage);
model.subscribe(updateView);
todoApp = React.render(
  <TodoApp
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
