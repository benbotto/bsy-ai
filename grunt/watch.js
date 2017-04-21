module.exports = function(grunt, scripts) {
  'use strict';

  const watch = {
    test: {
      options: {
        atBegin: true
      },
      files: scripts.server.api.concat(scripts.server.spec),
      tasks: ['jasmine_nodejs']
    },
    sass: {
      options: {
        atBegin: true
      },
      files: 'public/scss/**/*.scss',
      tasks: ['sass']
    }
  };

  grunt.loadNpmTasks('grunt-contrib-watch');

  return watch;
};

