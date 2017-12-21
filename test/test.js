/*
 * the-nomad.com ==> test
 * Created By barnabasnomo on 12/21/17 at 5:33 PM
 * @soundtrack Joromi - Simi
*/

var assert = require('assert'),
    Blog = require('../lib/blog'),
    blog = require('../lib/blog.json'),
    db = require('mongoose').connection.db
;

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(4)); // 4 is not present in this array so indexOf returns -1
        })
    })
});

describe('Blog', function () {
    describe('Check', function () {
        it('Should Check for Blog Objects', function () {
            assert.equal(typeof Blog, 'object');
            assert.equal(typeof Blog.findBlog, 'function');
            assert.equal(typeof Blog.createOne, 'function');
        })
    })
});