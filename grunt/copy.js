module.exports = function(grunt, srcIndex, buildIndex) {
  'use strict';

  const copy = {
    // The index is copied to the build directory and then updated with the
    // minified version of files by usemin.
    index: {
      src:  srcIndex,
      dest: buildIndex
    },
    // All images are copied to the build.
    img: {
      cwd:    __dirname + '/../public/',
      src:    'img/**/*',
      dest:   'build',
      expand: true
    },
    // All fonts are copied to the build.
    fonts: {
      cwd:   __dirname + '/../public/',
      src:   'fonts/**/*',
      dest:  'build',
      expand: true
    }
  };

  grunt.loadNpmTasks('grunt-contrib-copy');

  return copy;
};

