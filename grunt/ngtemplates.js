module.exports = function(grunt, html, angAppName) {
  'use strict';

  const files = html.map(function(file) {
    return file.replace(/^public\//, '');
  });

  const ngtemplates = {
    [angAppName]: {
      src:    files,
      cwd:    __dirname + '/../public/',
      dest:   '.tmp/js/templates.js',
      options: {
        // This is the usemin task to which the templates get concatenated.
        usemin: `js/${angAppName}.min.js`,
        htmlmin: {
          removeComments:     true,
          collapseWhitespace: true
        }
      }
    }
  };

  grunt.loadNpmTasks('grunt-angular-templates');

  return ngtemplates;
};

