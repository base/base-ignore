'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('arr-union', 'union');
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
