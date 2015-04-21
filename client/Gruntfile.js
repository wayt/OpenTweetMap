module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {scope: 'dependencies'});

    grunt.registerTask('default', [
        'build'
    ]);
    grunt.registerTask('build', [
        'clean',
        'html2js',
        'sass',
        'concat',
        'file-creator',
        'copy:assets'
    ]);

    grunt.registerTask('stage', [
        'default',
        'uglify'
    ]);

    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
            pkg: pkg,
            banner: '/*\n' +
	        '** <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>) - <%= pkg.description %>\n' +
	        '** <%= grunt.template.today("dd-mm-yyyy") %> <%= pkg.author %>\n' +
            '*/\n',
            dirs: {
                dest: 'build',
                lib: 'bower_components',
                src: 'source'
            },
            src: {
                tpl: {
                    app: ['source/app/**/*.tpl.html'],
                    common: ['source/common/**/*.tpl.html']
                },
                jsTpl: [
                    '<%= dirs.dest %>/templates/**/*.js'
                ]
            },
            clean: {
                build: ['build/'],
                temp: ['build/script.*.js']
            },
            concat: {
                options: {
                    banner: '<%= banner %>\n',
                    stripBanners: true
                },
                app_js: {
                    src: [
                        '<%= dirs.src %>/app/app.js', //Application
                        '<%= dirs.src %>/app/app.routes.js', //Application routes
                        '<%= dirs.src %>/app/module/**/*.controller.js', //Every controller files of every modules
                        '<%= dirs.src %>/app/module/**/*.routes.js', //Every route files of every modules
                        '<%= dirs.src %>/app/module/**/*.js', //Other files of every modules

                        '<%= dirs.src %>/app/common/**/*.js', //Shared files

                        '<%= src.jsTpl %>' //Link to html partials
                    ],
                    dest: '<%= dirs.dest %>/script.app.js',
                    nonull: true
                },
                librairies_js: {
                    src: [
                        '<%= dirs.lib %>/angular/angular.min.js', //Load angular first
                        '<%= dirs.lib %>/angular-route/*.min.js', //Every min file in bower_components/ subfolders
                        '<%= dirs.lib %>/angular-animate/*.min.js', // Angular animate (Material)
                        '<%= dirs.lib %>/angular-aria/*.min.js', //Angular aria (Material)
                        '<%= dirs.lib %>/angular-material/*.min.js', //Angular material
                        '<%= dirs.lib %>/ng-websocket/ng-websocket.js',
                        //'<%= dirs.lib %>/lodash/dist/*.min.js', //Lodash (Angular Gmaps)

                        //'<%= dirs.lib %>/angular-ui-utils/*.min.js', //Angular Google Maps
                        //'<%= dirs.lib %>/angular-ui-map/*.min.js'
                        '<%= dirs.lib %>/leaflet-plugins/layer/tile/Google.js'
                    ],
                    dest: '<%= dirs.dest %>/script.lib.js',
                    nonull: true
                },
                group: {
                    src: [
                        '<%= dirs.dest %>/script.app.js',
                        '<%= dirs.dest %>/script.lib.js',
                    ],
                    dest: '<%= dirs.dest %>/script.js', //Concat everything in one file
                    nonull: true
                },
                app_css: {
                    src: [
                        '<%= dirs.src %>/**/*.css' //Global style file
                    ],
                    dest: '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.min.css',
                    nonull: true
                },
                librairies_css: {
                    src: [
                        '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.min.css', // Global style file
                        '<%= dirs.lib %>/angular-material/*.min.css' //Angular material
                        //'<%= dirs.lib %>/**/dist/css/*.min.css', //Bootstrap, Bootstrap-sass and jQuery
                    ],
                    dest: '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.min.css', //Append lib css to global style file
                    nonull: true
                },
            },
            copy: {
                assets: {
                    files: [{dest: '<%= dirs.dest %>/assets/', src: '**', expand: true, cwd: 'source/assets/'}]
                }
            },
            'file-creator': {
                    index_html: {
                        'build/index.html': function(fs, fd, done) {
                            //Source html file
                            var index_html = grunt.file.read('source/index.html');

                            //Build global style file
                            var styles = [
                                'OpenTweetMap-1.0.0.min.css'
                            ],

                            //Build script files
                            scripts = [
                                'script.lib.js',
                                'script.app.js',
                                'script.js'
                            ],

                            //iterator
                            i;

                            for (i = 0 ; i < styles.length; i++) {
                                styles[i] = '<link rel="stylesheet" href="'+styles[i]+'">';
                            }
                            for (i = 0 ; i < scripts.length; i++) {
                                scripts[i] = '<script type="text/javascript" src="'+scripts[i]+'"></script>';
                            }

                            index_html = index_html
                            .replace('<!-- %%title%% -->', pkg.name)
                            .replace('<!-- %%styles%% -->', styles.join('\n\t'))
                            .replace('<!-- %%scripts%% -->', scripts.join('\n\t'));

                            fs.writeSync(fd, index_html);
                            done();
                        }
                    }
            },
            html2js: {
                app: {
                    options: {
                        base: '<%= dirs.src %>/app'
                    },
                    src: ['<%= src.tpl.app %>'],
                    dest: '<%= dirs.dest %>/templates/app.js',
                    module: 'templates.app'
                },
                common: {
                    option: {
                        base: '<%= dirs.src %>/common'
                    },
                    src: ['<%= src.tpl.common %>'],
                    dest: '<%= dirs.dest %>/templates/common.js',
                    module: 'templates.common'
                }
            },
            uglify: {
                options: {
                    banner: '<%= banner %>\n',
                    stripBanners: false
                },
                app_js: {
                    files: {
                        '<%= dirs.dest %>/script.app.js': ['<%= concat.app_js.dest %>']
                    }
                }
            },
            sass: {
                app_scss: {
                    options: {
                        style: 'nested'
                    },
                    files: {
                        '<%= dirs.src %>/style.css': ['<%= dirs.src %>/app/style.scss'] //Compile scss file to dest folder
                    }
                }
            },
            jshint: { //Check js files syntax
                files: [
                    'Gruntfile.js',
                    '<%= dirs.src %>/**/*.js'
                ],
                options: { // configure JSHint (documented at http://www.jshint.com/docs/options)
                    // more options here if you want to override JSHint defaults
                    freeze: true, // prohibits overwriting prototypes of native objects such as Array, Date and so on.
                    browser: true, // parameters option defines globals exposed by modern browsers (FileRead, document).
                    eqnull: true, // parameters option suppresses warnings about == null comparisons.
                    es3: false, // parameters option tells JSHint that your code needs to adhere to ECMAScript 3 specification -- We do not support legacy js environment such as IE6/7/8.
                    forin: true, // parameters option requires all for in loops to filter object's items.
                    eqeqeq: true, // parameters options prohibits the use of == and != in favor of === and !==.
                    latedef: true, // parameters option prohibits the use of a variable before it was defined
                    nonbsp: true, // parameters option warns about "non-breaking whitespace" characters
                    noempty: true, // parameters option warns when you have an empty block in your code
                    noarg: true, // parameters option prohibits the use of arguments.caller and arguments.callee
                    quotmark: true, // parameters option enforces the consistency of quotation marks used throughout your code
                    unused: 'vars', // parameters option warns when you define and never use your variables (set to vars to not check function parameters
                    trailing: true, // parameters option makes it an error to leave a trailing whitespace in your code
                    globals: {
                        console: true,
                        angular: true
                    }
                }
            }
    });


};
