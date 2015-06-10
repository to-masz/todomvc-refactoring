'use strict';
/* global kommando require */

var controls = require('./_controls');

var url = 'http://localhost/todomvc-refactoring/index.html';
var browser = kommando.browser;

browser.manage().window().setSize(800, 600);


describe('filter all completed items', function () {

  it('shows only the completed item', function(done) {
    var promise = controls.newPage(url);
    promise = controls.addTodo(promise, 'hallo');
    promise = controls.addTodo(promise, 'hallo 1');
    promise = controls.setFirstItemToCompleted(promise);
    promise = controls.filterByCompleted(promise);
    controls.assertInnerHtml(promise, 'golden-master-filterCompletedItems.html')
      .then(done, done);
  });

  it('updates the URL', function(done) {
    var promise = controls.newPage(url);
    promise = controls.addTodo(promise, 'hallo');
    promise = controls.addTodo(promise, 'hallo 1');
    promise = controls.setFirstItemToCompleted(promise);
    promise = controls.filterByCompleted(promise);
    controls.assertUrlToEndWith(promise, '#/completed')
      .then(done, done);
  });

});


// todo:
// - make a nice (a)sync API that we can replace by unit tests later
