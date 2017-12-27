/*
 * the-nomad.com ==> test
 * Created By barnabasnomo on 12/21/17 at 5:33 PM
 * @soundtrack Joromi - Simi
*/
require('dotenv').config();
require('../config/mongoose-defaults');
var Blog = require('../lib/blog'),
    Subscriber = require('../lib/subscribe'),
    blog = require('./blog.json'),
    connection = require('mongoose').connection,
    chai = require('chai'),
    expect = chai.expect,
    sitemap = require('../lib/sitemap')
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
});

describe('Subscription', function () {
    describe('Validator', function () {
        it('Should run validations for subscriber email', (done) => {
            Subscriber.subscribe('foo@bar.baz')
                .then(response => {
                    console.log(response);
                    expect(response.code).to.be.oneOf([0, 1]);
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    done();
                });
        });
    });
});


describe('Sitemap', function () {
    describe('Create', function () {
        it('Should create sitemap.xml file', (done) => {
            sitemap.createSitemapXML()
                .then(response => {
                    console.log(response);
                    expect(response).to.equal('Successfully Generated XML File.');
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    done();
                });
        });
    });
});


after(function () {
    connection.collections[Blog.collection].drop(function () {

        console.log(Blog.collection + " collection dropped.");
    });
    connection.collections[Subscriber.collection].drop(function () {

        console.log(Subscriber.collection + " collection dropped.");
    });
    connection.close(function () {
        console.log("Mongoose default connection disconnected on app termination");
    });
});
