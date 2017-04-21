module.exports = function(grunt, tmpDir) {
  'use strict';

  const babel = {
    options: {
      presets: ['es2015'],
      ignore: /lib.*/
    },
    dist: {
      files: [{ 
        expand: true, 
        src: `${tmpDir}concat/js/*.js`
      }]
    }
  };

  grunt.loadNpmTasks('grunt-babel');

  return babel;
};
