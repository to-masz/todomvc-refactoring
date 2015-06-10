'use strict';
/* global require */

var assert = require('assert');
var storageInterfaceChecks = require('./_storage-interface-checks');
var UrlStorage = require('../js/storage/urlstorage');

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
      var storage;
      beforeEach(function() {
        var urlQueryContent = {get: function() { return 'invalid JSON data'; }};
        storage = new UrlStorage(urlQueryContent);
      });
      it('doesn`t bail out on non-JSON content', function() {
        assert.doesNotThrow(function() { storage.getTodos(); });
      });
      it('returns an empty todo list', function() {
        assert.deepEqual(storage.getTodos(), []);
      });
    });
  });

  describe('`setTodos()`', function() {
    it('updates the url query parameter', function() {
      var value = null;
      var urlQueryContent = {set: function(s) { value = s; }};

      var todos = [{one: 'todo'}];
      var storage = new UrlStorage(urlQueryContent);
      storage.setTodos(todos);

      assert.equal(value, JSON.stringify(todos));
    });
  });

});
