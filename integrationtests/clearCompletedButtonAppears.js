'use strict';
/* global kommando  require __dirname */

var assertTrimmedString = require('./assertTrimmedString');

var path = require('path');
var fs = require('fs');

var url = 'http://localhost/todomvc-refactoring/index.html';
var browser = kommando.browser;

browser.manage().window().setSize(800, 600);

describe('appearance of clear completed button', function () {
    it('shows the Clear completed button', function (done) {
        // add 1 item
        browser.get(url)
            .then(function () {
                return browser.findElement(kommando.webdriver.By.id('new-todo')).click();
            })
            .then(function () {
                return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys('clear completed button appears');
            })
            .then(function () {
                return browser.findElement(kommando.webdriver.By.id('new-todo')).sendKeys(kommando.webdriver.Key.ENTER);
            })
            .then(function () {
                return browser.findElement(kommando.webdriver.By.id('new-todo')).click();
            })
            // set item to completed
            .then(function () {
                return browser.findElement(kommando.webdriver.By.css('#todo-list li input[type=checkbox]')).click();
            })
            .then(function () {
                return browser.findElement(kommando.webdriver.By.tagName('body')).getInnerHtml();
            })
            .then(function (html) {
                var reactAttrs = / data-react[-\w]+="[^"]+"/g;
                //fs.writeFileSync(path.join(__dirname, 'golden-master-clearCompletedButtonAppears.html'), html.replace(reactAttrs, ''));
                var expected = fs.readFileSync(path.join(__dirname, 'golden-master-clearCompletedButtonAppears.html'), 'utf8');
                assertTrimmedString(html.replace(reactAttrs, ''), expected);
            })
            .then(function () {
                return browser.executeScript('localStorage.clear();');
            })
            .then(done, done);
    });
});
