/*
 * the-nomad.com ==> season
 * Created By barnabasnomo on 1/5/18 at 12:55 PM
 * @soundtrack House On Fire - Sia
*/

const mongoose = require('mongoose'),
    Schema = mongoose.Schema
;
let SeasonSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }, subtitle: String,
    podcasts: [
        {type: Schema.Types.ObjectId, ref: 'Podcast'}
    ],
    no: Number,
    releaseDate: Date
});

module.exports = mongoose.model('Seasons', SeasonSchema);
