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
    inReplyTo: Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('comment', commentSchema);

commentSchema.pre('save', function (next) {
    let comment = this;

    if (this.isNew) {
        User.findOneAndUpdate({_id: comment.user}, {
            $push: {
                comments: {
                    $position: 0,
                    $each: [comment._id]
                }
            }
        }, function (err, user) {
            if (err) return next(new Error(err));
        });
    }
    if (this.isNew && !comment.isReply) {
        Podcast.findOneAndUpdate({_id: comment.podcast}, {
            $push: {
                comments: {
                    $each: [comment._id],
                    position: 0
                }
            }
        }, function (err, user) {
            if (err) return next(new Error(err));
        });
    }

    return next()
});