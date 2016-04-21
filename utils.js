'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('array-unique', 'unique');
require('mixin-deep', 'merge');
require('parse-gitignore', 'parseGitignore');
require('fs-exists-sync', 'exists');
require = fn;

/**
 * Expose `utils`
 */

module.exports = utils;
