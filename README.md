# base-ignore [![NPM version](https://img.shields.io/npm/v/base-ignore.svg?style=flat)](https://www.npmjs.com/package/base-ignore) [![NPM downloads](https://img.shields.io/npm/dm/base-ignore.svg?style=flat)](https://npmjs.org/package/base-ignore) [![Build Status](https://img.shields.io/travis/node-base/base-ignore.svg?style=flat)](https://travis-ci.org/node-base/base-ignore)

Adds an `.ignore` method that parses `.gitignore` and converts the patterns from wildmatch to glob patterns, so they can then be passed to glob, minimatch, micromatch, gulp.src, glob-stream, etc

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save base-ignore
```

## Usage

```js
var ignore = require('base-ignore');
var Base = require('base');
var app = new Base();

// register plugin
app.use(ignore());
```

**Example**

```js
var mm = require('micromatch');

var arr = ['node_modules/foo/index.js', 'foo.js', 'bar.txt'];
console.log(mm(arr, '**/*.js'));
//=> ['node_modules/foo/index.js', 'foo.js'];

var arr = ['node_modules/foo/index.js', 'foo.js', 'bar.txt'];
console.log(mm(arr, '**/*.js', {ignore: app.ignore()}));
//=> ['foo.js'];
```

## Caching

Patterns in `.gitignore` are parsed and converted to glob patterns and the converted patterns are cached. This is useful in applications that need to potentially match against the same set of files repeatedly.

## API

### [.gitignore](index.js#L41)

Get the `.gitignore` patterns for the current project. Also caches patterns on the `app.cache.ignored[cwd]` array.

**Params**

* `patterns` **{String|Array}**
* `options` **{Object}**
* `returns` **{Array}**: Returns the array of patterns stored for the current working directory

**Example**

```js
var gitignored = app.gitignore();
console.log(gitignored);

// or get the patterns from the cache
app.gitignore();
console.log(app.cache.ignored[process.cwd()]);
```

### [.ignore](index.js#L71)

Add one or more ignore patterns to `app.cache.ignored` for the current working directory.

**Params**

* `patterns` **{String|Array}**
* `options` **{Object}**
* `returns` **{Array}**: Returns the array of patterns stored for the current working directory

**Example**

```js
app.ignore('foo');
console.log(app.cache.ignored[process.cwd()]);
```

**Params**

* `fp` **{String}**
* `options` **{String}**: If `app.ignore()` and/or `app.gitignore()` have already been called, this will use the cached ignored patterns, but you can also/alternatively pass ignore patterns on `options.ignore`
* `returns` **{Boolean}**: Returns true if the filepath is ignored.

**Example**

```js
console.log(app.isIgnored('.DS_Store'));
//=> true
console.log(app.isIgnored('index.js'));
//=> false
```

## About

### Related projects

* [base-fs](https://www.npmjs.com/package/base-fs): base-methods plugin that adds vinyl-fs methods to your 'base' application for working with the file… [more](https://github.com/node-base/base-fs) | [homepage](https://github.com/node-base/base-fs "base-methods plugin that adds vinyl-fs methods to your 'base' application for working with the file system, like src, dest, copy and symlink.")
* [base](https://www.npmjs.com/package/base): base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting… [more](https://github.com/node-base/base) | [homepage](https://github.com/node-base/base "base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting with a handful of common methods, like `set`, `get`, `del` and `use`.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/node-base/base-ignore/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on July 27, 2016._