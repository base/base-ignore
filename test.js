'use strict';

require('mocha');
var assert = require('assert');
var mm = require('micromatch');
var Base = require('base');
var ignore = require('./');
var app;

describe('base-ignore', function() {
  beforeEach(function() {
    app = new Base();
    app.isApp = true;
    app.use(ignore());
  });

  describe('plugin', function() {
    it('should export a function', function() {
      assert.equal(typeof ignore, 'function');
    });

    it('should expose an `.ignore` method', function() {
      assert.equal(typeof app.ignore, 'function');
    });

    it('should expose a `.gitignore` method', function() {
      assert.equal(typeof app.gitignore, 'function');
    });
  });

  describe('.gitignore', function() {
    it('should create ignore patterns from .gitignore', function() {
      assert(app.gitignore().length);
      assert(app.gitignore().indexOf('**/.DS_Store/**') !== -1);
    });

    it('should work as glob ignore patterns', function() {
      var arr = ['node_modules/foo/index.js', 'foo.js', 'bar.txt'];
      assert.equal(mm(arr, '**/*.js').length, 2);
      var ignore = app.gitignore();
      assert.equal(mm(arr, '**/*.js', {ignore: ignore}).length, 1);
    });

    it('should work as glob negation patterns', function() {
      var arr = ['node_modules/foo/index.js', 'foo.js', 'bar.txt'];
      assert.equal(mm(arr, '**/*.js').length, 2);
      var ignore = app.gitignore().map(function(pattern) {
        return '!' + pattern;
      })
      assert.equal(mm(arr, ['**/*.js'].concat(ignore)).length, 1);
    });
  });

  describe('.ignore', function() {
    it('should create add ignore patterns to `app.cache.ignores`', function() {
      app.ignore('.DS_Store');
      assert(app.cache.ignores[process.cwd()].length);
      assert.equal(app.cache.ignores[process.cwd()][0], '**/.DS_Store/**');
    });

    it('should not add duplicates', function() {
      app.ignore('.DS_Store');
      app.ignore('.DS_Store');
      app.ignore('.DS_Store');
      assert.equal(app.cache.ignores[process.cwd()].length, 1);
    });
  });
});
