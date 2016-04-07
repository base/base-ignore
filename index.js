/*!
 * base-ignore (https://github.com/node-base/base-ignore)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('base-ignore');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('base-ignore')) return;

    this.define('ignore', function() {
      debug('running ignore');
      
    });
  };
};
