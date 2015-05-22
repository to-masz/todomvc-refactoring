'use strict';
/* global kommando  require __dirname module */

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var assertTrimmedString = require('./assertTrimmedString');
var browser = kommando.browser;

module.exports = {
  newPage: function(url) {
    return browser
      .get(url)
      .then(function() {
        return browser.executeScript('localStorage.clear();');
      })
      .then(function() {
        return browser.get(url);
      });
  },
  addTodo: function(promise, text) {
    return promise.then(function() {
      return browser.findElement(kommando.webdriver.By.id('new-todo')).click();
    })
      .then(function() {
        return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys(text);
      })
      .then(function() {
        return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys(kommando.webdriver.Key.ENTER);
      });
  },

  setFirstItemToCompleted: function(promise) {
    // set first item to completed
    return promise.then(function() {
      return browser.findElement(kommando.webdriver.By.css('#todo-list li input[type=checkbox]')).click();
    });
  },

  filterByCompleted: function(promise) {
    // click the completed filter button
    return promise.then(function() {
      return browser.findElement(kommando.webdriver.By.linkText('Completed')).click();
    });
  },

  assertInnerHtml: function(promise, goldenMasterFileName) {
    return promise
      .then(function() {
        return browser.findElement(kommando.webdriver.By.tagName('body')).getInnerHtml();
      })
      .then(function(html) {
        var reactAttrs = / data-react[-\w]+="[^"]+"/g;
        //fs.writeFileSync(path.join(__dirname, goldenMasterFileName), html.replace(reactAttrs, ''));
        var expected = fs.readFileSync(path.join(__dirname, goldenMasterFileName), 'utf8');
        assertTrimmedString(html.replace(reactAttrs, ''), expected);
      });
  },

  assertUrl: function(promise, expectedUrl) {
    return promise.then(function() {
      return browser.getCurrentUrl();
    })
      .then(function(currentUrl) {
        assert.equal(currentUrl, expectedUrl);
      });
  }
};
