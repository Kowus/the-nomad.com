require('dotenv').config();
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    config = require('./config/env'),
    session = require('express-session'),
    flash = require('connect-flash'),
    hbs = require('hbs'),
    compression = require('compression'),
    redis = require('redis').createClient(config.redis.url,{no_ready_check:true}),
    RedisStore = require('connect-redis')(session)
;
    require('./config/mongoose-defaults');



let routes = require('./routes/routes');



let app = express();
app.use(compression());

hbs.registerPartials('./views/partials');
hbs.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});
app.locals.curr_year = new Date().getUTCFullYear();
app.locals.tiny_mce = config.tiny_mce.key;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
require('./config/passport')(passport);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: config.session.secret,
    store: new RedisStore({client:redis})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next)=>{
    res.locals.user=req.user||null;
    next();
});

app.use('/', routes);
// app.use('/sitemap.xml', require('./config/sitemap'));

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
    res.locals.error = req.app.get('env') === 'development' ? err : {status:err.status||500, message:err.message||'Not Found.',stack:`Requested resource not found: ${req.url}`};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



redis.on('error', function (err) {
    console.log("Redis default connection error: " + err);
});



module.exports = app;
