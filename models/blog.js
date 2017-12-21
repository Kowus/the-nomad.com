/*
 * the-nomad.com ==> blog
 * Created By barnabasnomo on 12/21/17 at 3:57 PM
 * @soundtrack Pirates of the Caribbean: Dead Men Tell No Tales - Joachim Rønning; Espen Sandberg
*/

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    permalink: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categories: {
        type: Array
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:'Users'
    }, publish:{
        type:Boolean,
        default: false
    }

});

module.exports = mongoose.model('blog', BlogSchema);

BlogSchema.post('init', function(doc) {
    console.log('%s has been initialized from the db', doc._id);
});

BlogSchema.pre('save', function (next) {
    let blog = this;

    if (this.isModified('title')||this.isNew){
        blog.permalink = blog.title.trim().toLowerCase().split(/[\s,.-]+/).join('_');
    }

    return next();
});
