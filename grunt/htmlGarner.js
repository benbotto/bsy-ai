'use strict';

module.exports = function(verbose) {
  const glob = require('glob');
  const opts = {
    ignore: [
      'public/bower_components/**',
      'public/index.html'
    ]
  };

  // All the HTML files in the application that should be built.
  const html = glob.sync('public/**/*.html', opts);

  if (verbose) {
    console.log('htmlGarner gathered the following files.\n');
    console.log(html);
    console.log('\n');
  }

  return html;
};

