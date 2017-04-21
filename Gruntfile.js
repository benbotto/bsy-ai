'use strict';

module.exports = function(grunt) {
  const VERBOSE    = true;
  const buildDir   = __dirname + '/build/';
  const tmpDir     = __dirname + '/.tmp/';
  const srcIndex   = __dirname + '/public/index.html';
  const buildIndex = buildDir  + 'index.html';
  const angAppName = 'bsy-ai';

  // This object contains all scripts for the application.  The object has
  // properties describing each type of script (app, grunt, unitTests, etc.).
  // Pass true for verbose output.
  const scripts = require('./grunt/scriptGarner')(VERBOSE, angAppName);

  // This array contains all the html files for the application.  These files
  // are partial files, and are added to a javascript file as part of the
  // ngtemplates task.
  const html = require('./grunt/htmlGarner')(VERBOSE);

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-filerev');

  grunt.initConfig({
    clean:          require('./grunt/clean')(grunt, buildDir, tmpDir),
    jshint:         require('./grunt/jshint')(grunt, scripts),
    copy:           require('./grunt/copy')(grunt, srcIndex, buildIndex),
    useminPrepare:  require('./grunt/useminPrepare')(grunt, srcIndex, buildDir),
    ngtemplates:    require('./grunt/ngtemplates')(grunt, html, angAppName),
    filerev:        require('./grunt/filerev')(grunt, buildDir),
    usemin:         require('./grunt/usemin')(grunt, buildIndex),
    karma:          require('./grunt/karma')(grunt, scripts, html),
    jasmine_nodejs: require('./grunt/jasmine-nodejs')(grunt, scripts),
    watch:          require('./grunt/watch')(grunt, scripts),
    babel:          require('./grunt/babel')(grunt, tmpDir),
    sass:           require('./grunt/sass')(grunt, angAppName)
  });

  // Clean the temp and build directories.
  grunt.registerTask('clean_prebuild',  ['clean:tmp', 'clean:build']);

  // Copy static assets to the build directory.
  grunt.registerTask('copy_assets', [
    'copy:index',
    'copy:img',
    'copy:fonts'
  ]);

  // Build the native (desktop) application.
  grunt.registerTask('build_native', [
    'clean_prebuild',          // Remove the old build and .tmp directories.
    'jshint',                  // Check for lint.
    'karma:single',            // Make sure the client-side tests are passing.
    'jasmine_nodejs',          // Server-side tests.
    'copy_assets',             // Copy any static assets, such as images.
    'sass',                    // Compile SCSS to CSS
    'useminPrepare',           // Parse scripts and stylesheets from the index file.
    'ngtemplates',             // Put all template HTML into a script (preload angular cache).
    'concat',                  // Concatenate all JS and CSS.
    'babel',                   // Compile ES6.
    'uglify',                  // Minify JS.
    'cssmin',                  // Minify CSS.
    'filerev',                 // Cache bust with a hash of the file.
    'usemin',                  // Use the minified, cache-busted files.
    'clean:tmp'                // Remove the temporary folder.
  ]);

  // By default just build the native (desktop) application.
  grunt.registerTask('default', ['build_native']);
};
