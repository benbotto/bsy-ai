module.exports = function(grunt, srcIndex, buildDir) {
  'use strict';

  const useminPrepare = {
    html: srcIndex,
    options: {
      dest: buildDir
    }
  };

  grunt.loadNpmTasks('grunt-usemin');

  return useminPrepare;
};

