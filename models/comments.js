const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Podcast = require('./podcasts'),
    User = require('./user')
;

let commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    podcast: {
        type: Schema.Types.ObjectId,
        ref:'Podcast',
        required: true
    },

    content: String,
    replies: [
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    isReply: Boolean,
    replyTo: Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);
