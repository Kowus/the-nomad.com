/*
 * Created by barnabasnomo on 11/12/17 at 4:21 AM
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PodcastSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content:{
        url:String
    },
    categories: Array,
    host: {
        type: Schema.Types.ObjectId,
        required: true
    },
    guest: [
        {
            name: String,
            company: String,
            position: String,
            about: String
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Podcast', PodcastSchema);