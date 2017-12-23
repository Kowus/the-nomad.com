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
    Promise = require('bluebird'),
    User = require('../models/user')
;

let findBlog = Promise.promisify(function (permalink, callback) {
    Blog.findOne({permalink:permalink})
        .populate('author', 'displayName email')
        .exec((err, blog) => {
        if (err) return callback(err);
        let not_found = new Error("Couldn't find requested blog.");
        if (!blog) return callback(not_found);
        return callback(null, blog);

    });
});

let createOne = Promise.promisify(function (json_payload, callback) {
    let newBlog = new Blog();

    newBlog.title = json_payload.title;
    newBlog.permalink = json_payload.title.trim().toLowerCase().split(/[\s,.]+/).join('_');
    newBlog.content = json_payload.content;
    newBlog.categories = json_payload.categories;
    newBlog.description = json_payload.description;
    newBlog.date = new Date().toISOString();
    newBlog.publish = json_payload.publish === "yes";
    newBlog.author  = json_payload.author;

    newBlog.save(function (err, blog) {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, {success:true,message:`Inserted blog with reference url: ${blog.permalink}`})
        }
    }); 
});

module.exports = {
    collection:Blog.collection.name,
    createOne:createOne,
    findBlog:findBlog
};