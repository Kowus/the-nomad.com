/*
 * Created by barnabasnomo on 11/13/17 at 9:23 PM
*/
module.exports = (grunt) => {
    grunt.initConfig({
        autoprefixer: {
            single_file: {
                src: "public/stylesheets/src/main.css",
                dest: "public/stylesheets/src/main.css"
            }
        },
        cssmin: {
            target: {
                files: {
                    'public/stylesheets/dist/bundle.min.css': ['public/stylesheets/src/base.css', 'public/stylesheets/src/main.css', 'public/stylesheets/src/vendor.css']
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'public/javascripts/dist/bundle.min.js': ['public/javascripts/src/jquery-1.11.3.min.js', 'public/javascripts/src/jquery-migrate-1.2.1.min.js', 'public/javascripts/src/moment.js', 'public/javascripts/src/plugins.js', 'public/javascripts/src/main.js', 'public/javascripts/src/audio.js', 'public/javascripts/src/prism.js']
                }
            }
        },
        imagemin: {
            dynamic: {
                options:{
                    optimizationLevel:7,
                    svgoPlugins:[{removeViewBox: false}],
                },
                files: [{
                    expand: true,
                    cwd: 'public/images/src/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'public/images/dist/'
                }]
            }
        },
        watch: {
            css: {
                files: ['public/stylesheets/src/*.css'],
                tasks: ['css']
            }, scripts: {
                files: ['public/javascripts/src/*.js'],
                tasks: ['js'],
                options: {
                    interrupt: true
                }
            }, configFiles: {
                files: ['gruntfile.js'],
                options: {
                    reload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-autoprefixer");
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask('image',['imagemin']);
    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('css', ['autoprefixer', 'cssmin']);
    grunt.registerTask('bundle', ['css', 'js', 'image']);
    grunt.registerTask('default', ['bundle']);
};