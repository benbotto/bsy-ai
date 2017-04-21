/**
 * This function gathers all scripts used in the project and puts them in an object.
 */
module.exports = function(verbose, angAppName) {
  'use strict';

  const glob    = require('glob');
  const scripts = {};
  const opts    = {};

  // Library files.
  scripts.client     = {};
  scripts.client.lib = [
    'public/bower_components/gl-matrix/dist/gl-matrix-min.js',
    'public/bower_components/angular/angular.min.js',
    'public/bower_components/angular-route/angular-route.min.js',
    'public/bower_components/angular-mocks/angular-mocks.js',
    'public/bower_components/babel-polyfill/browser-polyfill.js'
  ];

  // All the scripts that make up the app.  Note that the module declarations
  // must come first.
  opts.ignore = [
    'public/bower_components/**',
    'public/bsy-graphics/bsy-graphics.js',
    `public/${angAppName}.js`,
    'public/**/*Spec.js'
  ];

  scripts.client.app = [
    'public/bsy-graphics/bsy-graphics.js',
    `public/${angAppName}.js`
  ].concat(glob.sync('public/**/*.js', opts));

  // Grunt tasks.
  scripts.grunt = glob.sync('grunt/**/*.js');

  // Client-side specs.
  opts.ignore = [
    'public/bower_components/**'
  ];

  scripts.client.spec   = glob.sync('public/**/*Spec.js', opts);
  scripts.client.helper = glob.sync('spec/helper/client/**/*Helper.js');

  // API files.
  opts.ignore        = ['api/**/*Spec.js'];
  scripts.server     = {};
  scripts.server.api = glob.sync('api/**/*.js', opts);

  // Server-side specs.
  scripts.server.spec = glob.sync('api/**/*Spec.js');

  // Server-side helpers.
  scripts.server.helper = glob.sync('spec/helper/server/**/*Helper.js');

  if (verbose) {
    const util = require('util');

    console.log('Script garner gathered the following files.\n');
    console.log(util.inspect(scripts, {depth: null}));
    console.log('\n');
  }

  return scripts;
};

