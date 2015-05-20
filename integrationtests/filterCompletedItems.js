'use strict';
/* global kommando  require __dirname */

var assertTrimmedString = require('./assertTrimmedString');

var path = require('path');
var fs = require('fs');

var url = 'http://localhost/todomvc-refactoring/index.html';
var browser = kommando.browser;

browser.manage().window().setSize(800, 600);

describe('filter all completed items', function () {
    it('shows only the completed item', function (done) {
        // add 2 items
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
                return browser.findElement(kommando.webdriver.By.tagName('body')).getInnerHtml();
            })
            .then(function (html) {
                var reactAttrs = / data-react[-\w]+="[^"]+"/g;
                //fs.writeFileSync(path.join(__dirname, 'golden-master-filterCompletedItems.html'), html.replace(reactAttrs, ''));
                var expected = fs.readFileSync(path.join(__dirname, 'golden-master-filterCompletedItems.html'), 'utf8');
                assertTrimmedString(html.replace(reactAttrs, ''), expected);
            })
            .then(function () {
                return browser.executeScript('localStorage.clear();');
            })
            .then(done, done);
    });
});