const mongoose = require('mongoose'),
    Schema = mongoose.Schema
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
    replies: Array
});