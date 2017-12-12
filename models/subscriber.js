/*
 * the-nomad.com ==> subscribe
 * Created By barnabasnomo on 12/8/17 at 12:29 PM
 * @soundtrack Juicy - Notorious BIG
*/

const mongoose = require('mongoose'),
    Schema = mongoose.Schema
;

let Subscriber = new Schema({
    email: String,
    confirmed: {
        type: Boolean,
        default:true
    }
});

module.exports = mongoose.model('Subscriber', Subscriber);