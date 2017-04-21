module.exports = function(grunt, scripts, html) {
  'use strict';

  const files = scripts.client.lib
    .concat(scripts.client.app)
    .concat(scripts.client.helper)
    .concat(scripts.client.spec)
    .concat(html);

  const karma = {
    options: {
      frameworks: ['jasmine'],
      port:       8765,
      files:      files,

      // Any html (directives) are put into a JS file and added to the template
      // cache.  In this manner no GET requests are made when testing
      // directives that use templateURL.  Each HTML file is added to a
      // self-titled module.  Refer to
      // https://github.com/karma-runner/karma-ng-html2js-preprocessor
      // http://karma-runner.github.io/0.12/config/configuration-file.html
      // https://github.com/vojtajina/ng-directive-testing
      preprocessors: {
        '**/*.html': ['ng-html2js']
      },
      ngHtml2JsPreprocessor: {
        stripPrefix: 'public/'
      }
    },
    interactive: {},
    open: {
      autoWatch: true,
      browsers : [
        'Chrome',
        'Firefox'
      ],
      singleRun: false
    },
    single: {
      singleRun: true,
      browsers:  ['Chrome', 'Firefox']
    }
  };

  grunt.loadNpmTasks('grunt-karma');

  return karma;
};

