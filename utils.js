'use strict';

var debug = require('debug')('base:ignore');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('base-cwd', 'cwd');
require('arr-union', 'union');
require('is-registered');
require('is-valid-instance');
require('mixin-deep', 'merge');
require('parse-gitignore', 'parseGitignore');
require('fs-exists-sync', 'exists');
require = fn;

utils.isValid = function(app) {
  if (!utils.isValidInstance(app)) {
    return false;
  }
  if (utils.isRegistered(app, 'base-ignore')) {
    return false;
  }
  debug('initializing <%s>, from <%s>', __filename, module.parent.id);
  return true;
};

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
