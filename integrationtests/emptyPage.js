'use strict';
/* global kommando  require */

var controls = require('./_controls');

var url = 'http://localhost/todomvc-refactoring/index.html';
var browser = kommando.browser;

browser.manage().window().setSize(800, 600);

describe('the basic site', function () {

    describe('should render correct ', function () {
        it('when nothing was clicked', function (done) {
          var promise = controls.newPage(url);
          controls.assertInnerHtml(promise, 'golden-master.html')
            .then(done, done);
        });
    });
});
