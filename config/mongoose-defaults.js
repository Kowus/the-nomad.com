/*
 * the-nomad.com ==> mongoose-defaults
 * Created By barnabasnomo on 12/21/17 at 7:45 PM
 * @soundtrack Ibiza - Omar Sterling
*/

var mongoose = require('mongoose'),
    config = require('./env')
;
mongoose.Promise = require('bluebird');
mongoose.connect(config.database.url, {
    useMongoClient: true,
    promiseLibrary: require('bluebird'),
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500
});


mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection connected');
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error:' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log("Mongoose default connection disconnected on app termination");
        process.exit(0);
    });
});
module.exports = mongoose;
