require('dotenv').config();
const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    config = require('./config/env'),
    session = require('express-session'),
    flash = require('connect-flash')
;

mongoose.connect(config.database.url, {useMongoClient: true});
let routes = require('./routes/routes');

let app = express();
app.locals.curr_year = new Date().getUTCFullYear();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
require('./config/passport')(passport);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:config.session.secret, resave:true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection connected')
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error:' + err)
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected')
});
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log("Mongoose default connection disconnected on app termination");
        process.exit(0);
    });
});


module.exports = app;
