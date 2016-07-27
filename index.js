/*!
 * base-ignore (https://github.com/node-base/base-ignore)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function(config) {
  return function plugin(app) {
    if (!utils.isValid(app, 'base-ignore')) return;

    // ignores cache
    this.cache.gitignored = this.cache.gitignored || {};
    this.cache.ignored = this.cache.ignored || {};
    this.use(utils.cwd());

    /**
     * Get the `.gitignore` patterns for the current project. Also caches
     * patterns on the `app.cache.ignored[cwd]` array.
     *
     * ```js
     * var gitignored = app.gitignore();
     * console.log(gitignored);
     *
     * // or get the patterns from the cache
     * app.gitignore();
     * console.log(app.cache.ignored[process.cwd()]);
     * ```
     * @name .gitignore
     * @param {String|Array} `patterns`
     * @param {Object} `options`
     * @return {Array} Returns the array of patterns stored for the current working directory
     * @api public
     */

    this.define('gitignore', function(options) {
      var opts = utils.merge({cwd: this.cwd}, config, options);
      if (this.cache.gitignored[opts.cwd]) {
        return this.cache.gitignored[opts.cwd];
      }

      var ignored = parseGitignore(opts);
      var arr = utils.union([], ignored, this.ignore(options));
      arr.sort(function(a, b) {
        return a.localeCompare(b);
      });

      return update(this, arr, opts);
    });

    /**
     * Add one or more ignore patterns to `app.cache.ignored` for
     * the current working directory.
     *
     * ```js
     * app.ignore('foo');
     * console.log(app.cache.ignored[process.cwd()]);
     * ```
     * @name .ignore
     * @param {String|Array} `patterns`
     * @param {Object} `options`
     * @return {Array} Returns the array of patterns stored for the current working directory
     * @api public
     */

    this.define('ignore', function(patterns, options) {
      var opts = utils.merge({cwd: this.cwd}, config, options);
      if (this.cache.ignored[opts.cwd]) {
        return this.cache.ignored[opts.cwd];
      }
      var ignored = utils.arrayify(patterns);
      return update(this, ignored, opts);
    });

    /**
     * Return true if the given `filepath` is ignored by `.gitignore` and/or any
     * custom ignore patterns that may have been defined.
     *
     * ```js
     * console.log(app.isIgnored('.DS_Store'));
     * //=> true
     * console.log(app.isIgnored('index.js'));
     * //=> false
     * ```
     *
     * @param {String} `fp`
     * @param {String} `options` If `app.ignore()` and/or `app.gitignore()` have already been called, this will use the cached ignored patterns, but you can also/alternatively pass ignore patterns on
     * `options.ignore`
     * @return {Boolean} Returns true if the filepath is ignored.
     * @api public
     */

    this.define('isIgnored', function(fp, options) {
      var opts = utils.merge({cwd: this.cwd}, config, options);
      var ignored = this.gitignore(options);
      fp = path.relative(opts.cwd, path.resolve(fp));
      return utils.mm.any(fp, ignored);
    });

    /**
     * Update the `ignores` cache with the given array of patterns.
     */

    function update(app, arr, opts) {
      app.union('cache.ignored.' + opts.cwd, arr);
      return app.cache.ignored[opts.cwd];
    }

    return plugin;
  };
};

/**
 * Directories to exclude in the search
 */

function parseGitignore(options) {
  options = options || {};
  var filepath = path.resolve(options.cwd, '.gitignore');
  var patterns = utils.union([], gitignore(filepath), options.patterns || []);

  if (options.defaults !== false) {
    patterns = utils.union([], patterns, [
      '*.sublime-*',
      '.DS_Store',
      '.git',
      '.idea',
      'bower_components',
      'node_modules',
      'npm-debug.log',
      'actual',
      'test/actual',
      'fixtures',
      'test/fixtures',
      'Thumbs.db',
      'tmp'
    ]);
  }
  return patterns.sort();
}

/**
 * Parse the local `.gitignore` file and add
 * the resulting ignore patterns.
 */

function gitignore(fp) {
  return utils.exists(fp) ? utils.parseGitignore(fp) : [];
}
