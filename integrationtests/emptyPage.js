'use strict';
/* global kommando  require __dirname */

var assert = require('assert');
var path = require('path');
var fs = require('fs');

var url = 'http://localhost/todomvc-refactoring/index.html';
var browser = kommando.browser;

browser.manage().window().setSize(800, 600);

describe('the basic site', function () {

    describe('should render correct ', function () {
        it('when nothing was clicked', function (done) {
            browser.get(url)
                .then(function(){return browser.findElement(kommando.webdriver.By.tagName('body')).getInnerHtml(); })
                .then(function (html) {
                    // fs.writeFileSync(path.join(__dirname, 'golden-master.html'), html);
                    var expected = fs.readFileSync(path.join(__dirname, 'golden-master.html'), 'utf8');
                    assert.equal(html, expected);
                })
                .then(done, done);
        });
    });
});
