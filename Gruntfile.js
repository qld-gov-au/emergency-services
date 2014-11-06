module.exports = function (grunt) {
    'use strict';

    // Path (for load-grunt-config)
    var path = require('path');
    // Configuration
    var config = {
        mode: null,
        limit: 5,
        interval: 5007,
        assets: 'assets/v2',
        build: 'build/_grunt',
        htdocs: 'build/_htdocs',
        swe: '../swe_template/build/_htdocs/assets'
    };

    var host = {
        port: {
            host: 9000,
            test: 9001
        },
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
    };

    // Load grunt config automatically
    require('load-grunt-config')( grunt, {
        // path to task.js files,
        configPath: path.join( process.cwd(), 'grunt' ),
        init: true,
        data: {
            // Metadata
            pkg: grunt.file.readJSON( 'package.json' ),
            bwr: grunt.file.readJSON( 'bower.json' ),
            // App config
            config: config,
            // Connect config
            host: host,
            // Task configuration
            copy: {
                // main
                main: {
                    files: [{
                        cwd: '<%= config.swe %>/v2/',
                        dest: '<%= config.htdocs %>/<%= config.assets %>/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    }, {
                        cwd: '<%= config.swe %>/includes/global/',
                        dest: '<%= config.htdocs %>/assets/includes/global/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    }, {
                        cwd: '<%= config.swe %>/includes/nav/',
                        dest: '<%= config.htdocs %>/assets/includes/nav/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    }, {
                        cwd: '<%= config.swe %>/images/',
                        dest: '<%= config.htdocs %>/assets/images/',
                        src: '**',
                        expand: true,
                        flatten: false,
                        filter: 'isFile'
                    }]
                }
            },
            clean: {
                base: {
                    files: [{
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= config.build %>',
                            '<%= config.htdocs %>'
                        ]
                    }]
                }
            }
        }
    });

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // default task
    grunt.registerTask( 'default', [
        'clean:base',
        'copy:main'
    ]);
};