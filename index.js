/*!
 * base-ignore (https://github.com/node-base/base-ignore)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var debug = require('debug')('base-ignore');
var utils = require('./utils');

module.exports = function(config, fn) {
  if (typeof config === 'function') {
    fn = config;
    config = {};
  }

  return function plugin(app) {
    if (!isValidInstance(this, fn)) return;
    debug('initializing <%s>, from <%s>', __filename, module.parent.id);

    this.define('ignore', function(options) {
      if (!this.ignoresCache) {
        this.define('ignoresCache', {});
      }

      var opts = utils.merge({cwd: process.cwd()}, config, options);
      if (this.ignoresCache[opts.cwd]) {
        return this.ignoresCache[opts.cwd];
      }

      var ignored = ignores(opts).map(function(pattern) {
        return toGlob(pattern);
      });

      return (this.ignoresCache[opts.cwd] = utils.unique(ignored));
    });

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

function ignores(options) {
  return gitignore(path.resolve(options.cwd, '.gitignore'))
    .concat(options.patterns || [])
    .concat([
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
    ])
    .sort();
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

/**
 * Only load the plugin onto a "valid" instance
 */

function isValidInstance(app, fn) {
  if (typeof fn === 'function' && !fn(app)) {
    return false;
  }
  if (app.isView || app.isItem || app.isFile) {
    return false;
  }
  if (app.isRegistered('base-ignore')) {
    return false;
  }
  return true;
}
