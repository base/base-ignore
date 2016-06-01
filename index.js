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
    if (!utils.isValid(app)) return;

    // ignores cache
    this.cache.ignores = this.cache.ignores || {};
    this.use(utils.cwd());

    /**
     * Get the `.gitignore` patterns for the current project. Also caches
     * patterns on the `app.cache.ignores[cwd]` array.
     *
     * ```js
     * var gitignored = app.gitignore();
     * console.log(gitignored);
     *
     * // or get the patterns from the cache
     * app.gitignore();
     * console.log(app.cache.ignores[process.cwd()]);
     * ```
     * @name .gitignore
     * @param {String|Array} `patterns`
     * @param {Object} `options`
     * @return {Array} Returns the array of patterns stored for the current working directory
     * @api public
     */

    this.define('gitignore', function(options) {
      if (!this.ignoresCache) {
        this.define('ignoresCache', {});
      }

      var opts = utils.merge({cwd: this.cwd}, config, options);
      if (this.cache.ignores[opts.cwd]) {
        return this.cache.ignores[opts.cwd];
      }

      var ignored = gitignored(opts).map(toGlob);
      return update(this, ignored, opts);
    });

    /**
     * Add one or more ignore patterns to `app.cache.ignores` for
     * the current working directory.
     *
     * ```js
     * app.ignore('foo');
     * console.log(app.cache.ignores[process.cwd()]);
     * ```
     * @name .ignore
     * @param {String|Array} `patterns`
     * @param {Object} `options`
     * @return {Array} Returns the array of patterns stored for the current working directory
     * @api public
     */

    this.define('ignore', function(patterns, options) {
      var opts = utils.merge({cwd: this.cwd}, config, options);
      var ignored = utils.arrayify(patterns).map(toGlob);
      return update(this, ignored, opts);
    });

    /**
     * Update the `ignores` cache with the given array of patterns.
     */

    function update(app, arr, opts) {
      var cached = app.cache.ignores[opts.cwd] || [];
      app.cache.ignores[opts.cwd] = utils.union([], cached, arr);
      return app.cache.ignores[opts.cwd];
    }

    return plugin;
  };
};

/**
 * Convert .gitignore (wildmatch) patterns to
 * glob (bash) patterns
 */

function toGlob(pattern) {
  pattern = pattern.replace(/^[*]{2}\/?|\/?[*]{2}$/g, '');
  pattern = pattern.replace(/^\/|\/$/, '');
  return '**/' + pattern + '/**';
}

/**
 * Directories to exclude in the search
 */

function gitignored(options) {
  options = options || {};
  var filepath = path.resolve(options.cwd, '.gitignore');
  var patterns = gitignore(filepath).concat(options.patterns || []);

  if (options.defaults !== false) {
    patterns = patterns.concat([
      '.git',
      '*.sublime-*',
      '.DS_Store',
      '.idea',
      'bower_components',
      'node_modules',
      'npm-debug.log',
      '{test/,}fixtures',
      '{test/,}actual',
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
  return utils.exists(fp)
    ? utils.parseGitignore(fp)
    : [];
}
