/* jshint unused:false, loopfunc:true, newcap:false */

module.exports = function (grunt) {
    'use strict';

    // # Globbing
    // for performance reasons we're only matching one level down:
    // 'test/spec/{,*/}*.js'
    // If you want to recursively match all subfolders, use:
    // 'test/spec/**/*.js'

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Connect include
    var ssInclude = require('connect-include');

    // Configurable paths
    var config = {
        app: 'src',
        dist: 'build',
        temp: '.tmp',
        assets: 'assets/v2',
        swe: '../swe_template/build/_htdocs/assets',
        directory: 'emergency',
        interval: 5007
    };

    var includes = {
        global: '/assets/includes/global/'
        //emergency: '/emergency/assets/includes/'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Assets
        assets: grunt.file.readJSON( 'assets.json' ),

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            options: {
                interval: config.interval // https://github.com/gruntjs/grunt-contrib-watch/issues/35#issuecomment-18508836
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: ['<%= config.app %>/assets/script/{,*/}*.js'],
                tasks: ['jshint:app', ],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['test:watch']
            },
            sass: {
                files: ['<%= config.app %>/assets/sass/{,*/}*.{scss,sass}'],
                tasks: ['sass:server']
            },
            styles: {
                files: ['<%= config.app %>/assets/style/{,*/}*.css'],
                tasks: ['newer:copy:styles']
            },
            html: {
                files: ['<%= config.app %>/{,*/}*.html'],
                tasks: ['newer:copy:html', 'newer:ssi:build']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '.tmp/styles/{,*/}*.css',
                    '<%= config.dist %>/{,*/}*.html',
                    '<%= config.dist %>/assets/images/{,*/}*',
                    '<%= config.dist %>/assets/includes/{,*/}*'
                ]
            }
        },

        // https://www.npmjs.org/package/grunt-ssi
        ssi: {
            build: {
                options: {
                    cache: 'all',
                    ext: '.html',
                    baseDir: 'build',
                    cacheDir: '.tmp/ssi'
                },
                files: [{
                    expand: true,
                    cwd: 'build/emergency',
                    src: ['*.html'],
                    dest: 'build/emergency'
                }]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                base: 'build',
                port: 9000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: {
                        target: 'http://localhost:9000/<%= config.directory %>' // target url to open
                    }
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            build: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.temp %>',
                        '<%= config.dist %>'
                    ]
                }]
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish-ex')
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            app: {
                src: '<%= config.app %>/assets/script/{,*/}*.js'
            }
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                }
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                loadPath: 'bower_components'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/styles',
                    src: ['*.{scss,sass}'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/styles',
                    src: ['*.{scss,sass}'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        concat: {
            app: {
                //options: '<%= concat.js.options %>',
                files: {
                    '<%= config.temp %>/assets/script/app.beta.js': '<%= assets.js.emergencyNewsroomApp %>'
                }
            }
        },

        uglify: {
            options: {
                beautify: true,
                mangle: true,
                preserveComments: false,
                compress: {
                    global_defs: {
                        TEST: false
                    },
                    dead_code: true
                }
            },
            app: {
                files: {
                    '<%= config.dist %>/assets/emergency/newsroom/app.beta.js': '<%= config.temp %>/assets/script/app.beta.js'
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            // swe build
            build: {
                files: [
                    {
                        cwd: '<%= config.swe %>/v2/',
                        dest: '<%= config.dist %>/<%= config.assets %>/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    },
                    {
                        cwd: '<%= config.swe %>/includes/global/',
                        dest: '<%= config.dist %>/assets/includes/global/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    },
                    {
                        cwd: '<%= config.swe %>/includes/nav/',
                        dest: '<%= config.dist %>/assets/includes/nav/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    },
                    {
                        cwd: '<%= config.swe %>/images/',
                        dest: '<%= config.dist %>/assets/images/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    }
                ]
            },
            src: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>/<%= config.directory %>',
                    src: [
                        '{,*/}*.html',
                        'assets/images/**/*.*',
                        'assets/includes/**/*.*',
                        '!_bak/**'
                    ]
                }]
            },
            html: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>/emergency',
                    src: [
                        '{,*/}*.html',
                        '!_bak/**'
                    ]
                }]
            }
        }
    });


    grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
        if (grunt.option('allow-remote')) {
            grunt.config.set('connect.options.hostname', '0.0.0.0');
        }
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:build',
            'copy:build',
            'copy:src',
            'ssi:build',
//            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function (target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:build'
            ]);
        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'clean:build',
        'copy:build',
        'copy:src'
    ]);

    grunt.registerTask('default', [
        'clean:build',
        'copy:build',
        'copy:src'
    ]);
};
