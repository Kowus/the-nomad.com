/*
 * Created by barnabasnomo on 11/13/17 at 9:23 PM
*/

module.exports = (grunt) => {
    grunt.initConfig({
        cssmin: {
            target: {
                files: {
                    'public/stylesheets/dist/bundle.min.css': ['public/stylesheets/src/base.css', 'public/stylesheets/src/main.css', 'public/stylesheets/src/vendor.css']
                    }
            }
        },watch:{
            css:{
                files:['public/stylesheets/src/*.css'],
                tasks:['css']
            },scripts:{
                files:['public/javascripts/src/*.js'],
                tasks:['js']
            }
        },
        uglify:{
            my_target:{
                files:{
                    'public/javascripts/dist/bundle.min.js':['public/javascripts/src/jquery-1.11.3.min.js','public/javascripts/src/jquery-migrate-1.2.1.min.js','public/javascripts/src/plugins.js','public/javascripts/src/main.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('js', ['uglify']);
    grunt.registerTask('css',['cssmin']);
    grunt.registerTask('default', ['cssmin','js'])
};