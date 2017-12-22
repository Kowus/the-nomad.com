/*
 * the-nomad.com ==> test
 * Created By barnabasnomo on 12/21/17 at 5:33 PM
 * @soundtrack Joromi - Simi
*/
require('dotenv').config();
require('../config/mongoose-defaults');
var Blog = require('../lib/blog'),
    blog = require('./blog.json'),
    connection = require('mongoose').connection,
    chai = require('chai'),
    expect = chai.expect
;


describe('Blog', function () {

    describe('Create Entry', function () {

        it('Blog.createOne(blog) should equal Inserted blog with reference url: node_js_open_cv_face_match', (done) => {
            Blog.createOne(blog)
                .then(function (data) {
                    expect(data.success).to.equal(true);
                })
                .finally(done());
        });
    });

    describe('Find Entry', function () {
        it('Blog.findOne(permalink) should return blog object with reference url: node_js_open_cv_face_match', (done) => {
            Blog.findBlog('node_js_opencv_face_match')
                .then(function (blog) {
                    expect('node_js_opencv_face_match').to.equal(blog.permalink.toString());
                }).catch(function (err) {
                    console.error(err.message);
                })
                .finally(() => {

                    done();
                });
        });

    });


    after(function () {
        connection.collections[Blog.collection].drop(function () {

            console.log("Collection dropped");
        });
        connection.close(function () {
            console.log("Mongoose default connection disconnected on app termination");
        });
    });
});
