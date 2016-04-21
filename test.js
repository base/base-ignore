'use strict';

require('mocha');
var assert = require('assert');
var ignore = require('./');
var Base = require('base');
var mm = require('micromatch');
var app;

describe('base-ignore', function() {
  beforeEach(function() {
    app = new Base();
    app.use(ignore());
  });

  describe('plugin', function() {
    it('should export a function', function() {
      assert.equal(typeof ignore, 'function');
    });

    it('should expose an ignore method', function() {
      assert.equal(typeof app.ignore, 'function');
    });
  });

  describe('.ignore', function() {
    it('should create ignore patterns from .gitignore', function() {
      assert(app.ignore().length);
      assert(app.ignore().indexOf('**/.DS_Store/**') !== -1);
    });

    it('should work as glob ignore patterns', function() {
      var arr = ['node_modules/foo/index.js', 'foo.js', 'bar.txt'];
      assert.equal(mm(arr, '**/*.js').length, 2);
      var ignore = app.ignore();
      assert.equal(mm(arr, '**/*.js', {ignore: ignore}).length, 1);
    });

    it('should work as glob negation patterns', function() {
      var arr = ['node_modules/foo/index.js', 'foo.js', 'bar.txt'];
      assert.equal(mm(arr, '**/*.js').length, 2);
      var ignore = app.ignore().map(function(pattern) {
        return '!' + pattern;
      })
      assert.equal(mm(arr, ['**/*.js'].concat(ignore)).length, 1);
    });
  });
});
