module.exports = function(grunt, scripts) {
  'use strict';

  const jasmineNode = {
    options: {
      specNameSuffix: 'Spec.js',
      useHelpers:     false,
      stopOnFailure:  false
    },
    all: {
      specs: scripts.server.spec
    }
  };

  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  return jasmineNode;
};

