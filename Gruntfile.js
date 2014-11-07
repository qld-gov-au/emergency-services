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

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist',
        temp: '.tmp',
        build: 'build',
        assets: 'assets/v2',
        swe: '../swe_template/build/_htdocs/assets',
        interval: 5007
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

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
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['test:watch']
            },
            sass: {
                files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*',
                    '<%= config.app %>/includes/{,*/}*'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                base: './',
                port: 9000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost',
                middleware: function( connect, options, middlewares ) {
                    options = options || {};
                    options.index = options.index || 'index.html';
                    middlewares.unshift(function globalIncludes( req, res, next ) {
                        var fs = require('fs');
                        var filename = require( 'url' ).parse( req.url ).pathname;
                        if ( /\/$/.test( filename )) {
                            filename += options.index;
                        }

                        if ( /\.html$/.test( filename )) {
                            fs.readFile( options.base + filename, 'utf-8', function( err, data ) {
                                if ( err ) {
                                    next( err );
                                } else {
                                    res.writeHead( 200, { 'Content-Type': 'text/html' });
                                    data = data.split( '<!--#include virtual="/assets/includes/global/' );
                                    res.write( data.shift(), 'utf-8' );
                                    data.forEach(function( chunk ) {
                                        res.write( fs.readFileSync( options.base + '/assets/includes/global/' + chunk.substring( 0, chunk.indexOf( '"-->' )), 'utf-8' ), 'utf-8' );
                                        res.write( chunk.substring( chunk.indexOf( '-->' ) + 3 ), 'utf-8' );
                                    });
                                    res.end();
                                }
                            });

                        } else {
                            next();
                        }
                    });
                    return middlewares;
                }
            },
            livereload: {
                options: {
//                    middleware: function(connect) {
                    middleware: function( connect, options, middlewares ) {
//                        return [
//                            //connect.static('.tmp'),
//                            //connect().use('/bower_components', connect.static('./bower_components')),
//                            //connect.static(config.build)
//                            connect.static('/')
//                        ];

                        middlewares.unshift(connect.static('build'));
                        console.log(middlewares);
                        return middlewares;
                    }
                }
            },
            test: {
                options: {
                    open: false,
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use('/bower_components', connect.static('./bower_components')),
                            connect.static(config.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    base: '<%= config.dist %>',
                    livereload: false
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
                        '<%= config.build %>'
                    ]
                }]
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require( 'jshint-stylish-ex' )
            },

            gruntfile: {
                src: 'Gruntfile.js'
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

        // Copies remaining files to places other tasks can use
        copy: {
            // swe build
            build: {
                files: [
                    {
                        cwd: '<%= config.swe %>/v2/',
                        dest: '<%= config.build %>/<%= config.assets %>/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    },
                    {
                        cwd: '<%= config.swe %>/includes/global/',
                        dest: '<%= config.build %>/assets/includes/global/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    },
                    {
                        cwd: '<%= config.swe %>/includes/nav/',
                        dest: '<%= config.build %>/assets/includes/nav/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    },
                    {
                        cwd: '<%= config.swe %>/images/',
                        dest: '<%= config.build %>/assets/images/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    }
                ]
            },
            app: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.build %>/emergency',
                    src: [
                        '{,*/}*.html',
                        'assets/images/**/*.*',
                        'assets/includes/**/*.*'
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
            'copy:app',
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
                'clean:server',
            ]);
        }

        grunt.task.run([
            'connect:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'clean:build',
        'copy:build'
    ]);

    grunt.registerTask('default', [
        'clean:build',
        'copy:build'
    ]);
};
