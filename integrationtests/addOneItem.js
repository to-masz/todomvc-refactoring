'use strict';
/* global kommando  require __dirname */

var assertTrimmedString = require('./assertTrimmedString');

var path = require('path');
var fs = require('fs');

var url = 'http://localhost/todomvc-refactoring/index.html';
var browser = kommando.browser;

browser.manage().window().setSize(800, 600);

describe('add one item', function () {

  it('renders correctly', function (done) {
      browser.get(url)
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
              return browser.findElement(kommando.webdriver.By.tagName('body')).getInnerHtml();
          })
          .then(function (html) {
              var reactAttrs = / data-react[-\w]+="[^"]+"/g;

              //fs.writeFileSync(path.join(__dirname, 'golden-master-addOneItem.html'), html.replace(reactAttrs, ''));
              var expected = fs.readFileSync(path.join(__dirname, 'golden-master-addOneItem.html'), 'utf8');
              assertTrimmedString(html.replace(reactAttrs, ''), expected);
          })
          .then(done, done);
  });

});
