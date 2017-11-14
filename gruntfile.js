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
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('css',['cssmin']);
    grunt.registerTask('default', ['cssmin'])
};