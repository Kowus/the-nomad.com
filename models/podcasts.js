/*
 * Created by barnabasnomo on 11/12/17 at 4:21 AM
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let PodcastSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }, subtitle: String,
    content: {
        src: String,
        text: String,
        banner_picture: String
    },
    season: {
        type: Number
    },
    no: {
        type: Number
    },
    episode:Number,
    take_aways: {
        type: Array
    },
    categories: Array,
    permalink: {
        type: String,
        unique: true
    },
    guest: {
        name: String,
        company: String,
        position: String,
        about: String,
        twitter:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }, comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    stats: {
        views: {
            type: Number,
            default: 0
        },
        played: {
            type: Number,
            default: 0
        }
    },
    location: {
        x: Number,
        y: Number,
        des: String
    }
});

PodcastSchema.pre('save', function (next) {
    let podcast = this;
    if (this.take_aways.length > 3) {
        let err = new Error("Only 3 takeaway lessons are allowed.");
        return next(err);
    }
    if (this.isModified('title') || this.isNew) {
        podcast.permalink = podcast.title.trim().toLowerCase().split(/[\s,.-]+/).join('_');
    }

    return next();
});


module.exports = mongoose.model('Podcast', PodcastSchema);