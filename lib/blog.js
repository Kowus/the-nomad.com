/*
 * the-nomad.com ==> blog
 * Created By barnabasnomo on 12/21/17 at 3:57 PM
 * @soundtrack Pirates of the Caribbean: Dead Men Tell No Tales - Joachim Rønning; Espen Sandberg
*/

/*
* Create these functions
* 1. Create a blog
* 2. Update a blog
* 3. Find a blog
* 4. Delete a blog
* */

const Blog = require('../models/blog'),
    Promise = require('bluebird')
;

let findBlog = Promise.promisify(function (permalink, callback) {
    Blog.findOne({permalink: permalink}).populate('users').exec((err, blog) => {
        if (err) return callback(err);
        let not_found = new Error("Couldn't find requested blog.");
        if (!blog) return callback(not_found);
        return callback(null, blog);

    });
});

module.exports = {
    findBlog:findBlog
};