'use strict';

var debug = require('debug')('base:ignore');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('base-cwd', 'cwd');
require('arr-union', 'union');
require('is-valid-app', 'isValid');
require('micromatch', 'mm');
require('mixin-deep', 'merge');
require('parse-gitignore', 'parseGitignore');
require('fs-exists-sync', 'exists');
require = fn;

/**
 * Cast val to an array
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Expose `utils`
 */

module.exports = utils;
