const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Podcast = require('./podcasts'),
    User = require('./user')
;

let commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    podcast: {
        type: Schema.Types.ObjectId,
        required: true
    },

    content: String,
    replies: Array,
    isReply: Boolean,
    replyTo: Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('comment', commentSchema);
