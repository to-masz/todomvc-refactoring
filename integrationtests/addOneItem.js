'use strict';
/* global kommando require */

var controls = require('./_controls');

var url = 'http://localhost/todomvc-refactoring/index.html';
var browser = kommando.browser;

browser.manage().window().setSize(800, 600);

describe('add one item', function () {

  it('renders correctly', function (done) {
    var promise = controls.newPage(url);
    promise = controls.addTodo(promise, 'hallo');
    controls.assertInnerHtml(promise, 'golden-master-addOneItem.html')
      .then(done, done);
  });

});
