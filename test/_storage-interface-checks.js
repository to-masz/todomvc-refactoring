'use strict';
/* global require module */

var assert = require('assert');

function doesImplement(obj, methodNames, objectName) {
  methodNames.forEach(function(methodName) {
    var message = 'Expected `' + objectName + '` to implement `' + methodName + '()`';
    assert.ok(methodName in obj, message);
  });
}

function storageInterfaceChecks(obj, objectName) {
  doesImplement(obj, ['get', 'set'], objectName);
}

module.exports = storageInterfaceChecks;
