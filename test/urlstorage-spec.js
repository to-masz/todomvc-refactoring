'use strict';
/* global require */

var assert = require('assert');
var storageInterfaceChecks = require('./_storage-interface-checks');

describe('URL storage', function() {

  it('verify interface', function() {
    var storage = new UrlStorage();
    storageInterfaceChecks(storage, 'UrlStorage');
  });

  describe('`getTodos()`', function() {
    it('properly decodes the data from the URL query param', function() {
      var todos = [{id: 1, title: 'title'}];
      var urlQueryContent = {get: function() { return JSON.stringify(todos); }};
      var storage = new UrlStorage(urlQueryContent);

      assert.deepEqual(storage.getTodos(), todos);
    });
    describe('with invalid input', function() {
      it('doesn`t bail out on non-JSON content', function() {
        var urlQueryContent = {get: function() { return 'invalid JSON data'; }};
        var storage = new UrlStorage(urlQueryContent);

        assert.doesNotThrow(function() { storage.getTodos(); });
      });
      it('returns an empty todo list', function() {
        var urlQueryContent = {get: function() { return 'invalid JSON data'; }};
        var storage = new UrlStorage(urlQueryContent);

        assert.deepEqual(storage.getTodos(), []);
      });
    });
  });

});

function UrlStorage(urlQueryContent) {
  this.getTodos = function() {
    try {
      return JSON.parse(urlQueryContent.get());
    } catch (e) {
      var noData = [];
      return noData;
    }
  };
  this.setTodos = function() {};
}
