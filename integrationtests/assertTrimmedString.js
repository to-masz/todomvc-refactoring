'use strict';

/* global require module */

var assert = require('assert');

function trim(s) {
    return s.replace(/^\s+/, '').replace(/\s+$/, '');
}

function highlightNewLines(s) {
    return s.replace('\n', '¶');
}

function getDiffMessage(s1, s2) {
    var diffAt = 0;
    s1.split('').every(function(s, idx) {
        diffAt++;
        return s2[idx] === s;
    });
    var prefixLength = 30;
    var suffixLength = 30;
    return 'diffs at ' + diffAt + ' position (charCode is ' + s1[diffAt].charCodeAt(0) + ' but expected ' + s2[diffAt].charCodeAt(0) + ')'
        + '\n' + highlightNewLines(s1.substr(diffAt - prefixLength, prefixLength + suffixLength))
        + '\n' + highlightNewLines(s2.substr(diffAt - prefixLength, prefixLength + suffixLength))
        + '\n' + (new Array(prefixLength)).join('=') + '^';
}

function trimLines(s) {
    return s.split('\n').map(trim);
}

function removeEmptyAttributes(s) {
  return s.replace(/\s\w+=""/g, '');
}

function assertTrimmedString(s1, s2) {
    var cleanedS1 = removeEmptyAttributes(trim(s1));
    var cleanedS2 = removeEmptyAttributes(trim(s2));
    var message = '=';
    if (cleanedS1 !== cleanedS2) {
        message = getDiffMessage(cleanedS1, cleanedS2);
    }
    return assert.deepEqual(trimLines(cleanedS1), trimLines(cleanedS2), message);
}

module.exports = assertTrimmedString;
