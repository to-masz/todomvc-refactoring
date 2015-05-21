'use strict';
/* global kommando  require __dirname */

var assert = require('assert');
var assertTrimmedString = require('./assertTrimmedString');

var path = require('path');
var fs = require('fs');

var url = 'http://localhost/todomvc-refactoring/index.html';
var browser = kommando.browser;

browser.manage().window().setSize(800, 600);

function newPage() {
  return browser
    .get(url)
    .then(function () {
        return browser.executeScript('localStorage.clear();');
    })
    .then(function () {
      return browser.get(url);
    });
}
function addTodo(promise, text) {
  return promise.then(function () {
      return browser.findElement(kommando.webdriver.By.id('new-todo')).click();
  })
  .then(function () {
      return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys('hallo');
  })
  .then(function () {
      return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys(kommando.webdriver.Key.ENTER);
  });
}

function setFirstItemToCompleted(promise) {
  // set first item to completed
  return promise.then(function () {
      return browser.findElement(kommando.webdriver.By.css('#todo-list li input[type=checkbox]')).click();
  });
}

function filterByCompleted(promise) {
  // click the completed filter button
  return promise.then(function () {
      return browser.findElement(kommando.webdriver.By.linkText('Completed')).click();
  });
}

function assertEqual(promise, goldenMasterFileName) {
  return promise
    .then(function () {
        return browser.findElement(kommando.webdriver.By.tagName('body')).getInnerHtml();
    })
    .then(function (html) {
        var reactAttrs = / data-react[-\w]+="[^"]+"/g;
        //fs.writeFileSync(path.join(__dirname, goldenMasterFileName), html.replace(reactAttrs, ''));
        var expected = fs.readFileSync(path.join(__dirname, goldenMasterFileName), 'utf8');
        assertTrimmedString(html.replace(reactAttrs, ''), expected);
    });
}

describe('filter all completed items', function () {

  it('shows only the completed item', function(done) {
    // add 2 items
    var promise = newPage();
    promise = addTodo(promise, 'hallo');
    promise = addTodo(promise, 'hallo 1');
    promise = setFirstItemToCompleted(promise);
    promise = filterByCompleted(promise);
    promise = assertEqual(promise, 'golden-master-filterCompletedItems.html');
    promise.then(done, done);
  });

  it('updates the URL', function(done) {
    // add 2 items
    browser.get(url)
      .then(function () {
          return browser.executeScript('localStorage.clear();');
      })
      .then(function () {
        return browser.get(url);
      })
      .then(function () {
          return browser.findElement(kommando.webdriver.By.id('new-todo')).click();
      })
      .then(function () {
          return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys('hallo');
      })
      .then(function () {
          return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys(kommando.webdriver.Key.ENTER);
      })
      .then(function () {
          return browser.findElement(kommando.webdriver.By.id('new-todo')).click();
      })
      .then(function () {
          return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys('hallo 1');
      })
      .then(function () {
          return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys(kommando.webdriver.Key.ENTER);
      })
      // set first item to completed
      .then(function () {
          return browser.findElement(kommando.webdriver.By.css('#todo-list li input[type=checkbox]')).click();
      })
      // click the completed filter button
      .then(function () {
          return browser.findElement(kommando.webdriver.By.linkText('Completed')).click();
      })
      .then(function () {
          return browser.getCurrentUrl();
      })
      .then(function (currentUrl) {
          assert.equal(currentUrl, url + '#/completed');
      })
      .then(done, done);
  });

});


// todo:
// - make a nice (a)sync API that we can replace by unit tests later
