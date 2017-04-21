module.exports = function(grunt, angAppName) {
  'use strict';

  const sass = {
    dist: {
      files: {
        [`public/css/${angAppName}.css`] : `${__dirname}/../public/scss/${angAppName}.scss`,
        'public/css/vendor.css': `${__dirname}/../public/scss/vendor.scss`
      },
      options: {
        sourceMap: false,
        includePaths: [
          'public/scss/lib'
        ]
      }
    }
  };

  grunt.loadNpmTasks('grunt-sass');

  return sass;
};
