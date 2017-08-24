module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/build.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
        'public/dist/build.min.js': ['public/dist/build.js']
        }
      }
    },

    eslint: {
      target: [
        // Add list of files to lint here
        'public/client/*.js'
      ]
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public',
          src: ['*.css', '!*.min.css'],
          dest: 'public',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    gitadd: {
      task: {
        options: {
          all: true
        }
      }
    },

    gitcommit: {
      your_target: {
        options: {
        // Target-specific options go here.
        }
      }
    },

    gitpush: {
      your_target: {
        options: {
        // Target-specific options go here.
          remote: 'deploy',
          branch: 'master'
        }
      }
    },

    shell: {
      prodServer: {
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'eslint',
    // 'test',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('git-batch', [
    'gitadd',
    'gitcommit',
    'gitpush'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {// grunt upload --prod
      // add your production server task here
      //add our environmental variable?
      process.env.PRODUCTION = true;
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([
        'build',
        'git-batch',
        'upload'
        ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });



};
