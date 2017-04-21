module.exports = function(grunt, buildDir) {
  'use strict';

  // Make revisions of all js and css files.
  const filerev =  {
    js: {
      src: buildDir + 'js/*.js'
    },
    css: {
      src: buildDir + 'css/*.css'
    }
  };

  grunt.loadNpmTasks('grunt-filerev');

  return filerev;
};

