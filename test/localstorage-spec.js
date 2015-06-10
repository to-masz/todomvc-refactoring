'use strict';
/* global require */

var LocalStorage = require('../js/storage/localstorage');
var storageInterfaceChecks = require('./_storage-interface-checks');

describe('LocalStorage', function() {

  var storage;
  beforeEach(function() {
    storage = new LocalStorage();
  });

  it('verify interface', function() {
    storageInterfaceChecks(storage, 'UrlStorage');
  });

});
