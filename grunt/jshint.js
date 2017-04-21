module.exports = function(grunt, scripts) {
  'use strict';

  const jshint = {
    /* Global options. */
    options: {
      strict:    true,
      eqeqeq:    true,
      indent:    2,
      quotmark:  'single',
      undef:     true,
      unused:    true,
      esnext:    true,
      reporter:  require('jshint-stylish'),
      force:     true
    },

    /* Get the lint out of all app files. */
    app: {
      options: {
        browser: true,
        globals: {
          angular: true
        }
      },
      files: {
        src: scripts.client.app
      }
    },

    /* Unit tests. */
    appUnitTests: {
      options: {
        globals: {
          angular:    true,
          module:     true,
          describe:   true,
          it:         true,
          expect:     true,
          beforeEach: true,
          afterEach:  true,
          beforeAll:  true,
          afterAll:   true,
          spyOn:      true,
          inject:     true,
          jasmine:    true,
          console:    true
        }
      },
      files: {
        src: scripts.client.spec
      }
    },

    /* Grunt files. */
    grunt: {
      options: {
        node: true
      },
      files: {
        src: scripts.grunt
      }
    },

    /* API files. */
    api: {
      options: {
        node: true
      },
      files: {
        src: scripts.server.api
      }
    },

    /* Server-side specs. */
    serverSpec: {
      options: {
        node: true,
        globals: {
          describe:   true,
          xdescribe:  true,
          it:         true,
          xit:        true,
          expect:     true,
          beforeEach: true,
          afterEach:  true,
          beforeAll:  true,
          afterAll:   true,
          spyOn:      true,
          jasmine:    true,
          console:    true
        }
      },
      files: {
        src: scripts.server.spec.concat(scripts.server.helper)
      }
    }
  };

  grunt.loadNpmTasks('grunt-contrib-jshint');

  return jshint;
};

