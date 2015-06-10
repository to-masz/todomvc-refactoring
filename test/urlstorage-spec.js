'use strict';
/* global require */

var assert = require('assert');
var storageInterfaceChecks = require('./_storage-interface-checks');

describe('URL storage', function() {

  var storage;
  beforeEach(function() {
    storage = new UrlStorage();
  });

  it('verify interface', function() {
    storageInterfaceChecks(storage, 'UrlStorage');
  });

});

function UrlStorage() {
  this.get = function() {};
  this.set = function() {};
}