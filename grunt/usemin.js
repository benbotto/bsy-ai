module.exports = function(grunt, buildIndex) {
  'use strict';

  const usemin = {
    html: [buildIndex]
  };

  grunt.loadNpmTasks('grunt-usemin');

  return usemin;
};

