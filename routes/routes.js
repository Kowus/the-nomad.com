let express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Podcast = require('../models/podcasts')
;

/* GET home page. */
router.get('/', function (req, res, next) {
    Podcast.aggregate(
        [
            {$sort: {createdAt: -1}},
            {$limit: 3}
        ], function (err, podcasts) {
            if (err) return res.send("An error occurred: " + err);
            res.render('index', {title: "The Nomad", podcasts: podcasts, user: req.user || null});
        });
});

router.get('/login', isNotLoggedIn, function (req, res, next) {
    req.session.next = req.query.next || '/';
    let message = req.session.message || req.flash('loginMessage');
    if (req.session.message) req.session.message = null;
    res.render('login', {title: 'Login', hide_footer: true, message: message});
});

router.post('/login', isNotLoggedIn, passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', isLoggedIn, function (req, res, next) {
    let next_page = req.session.next || '/';
    res.redirect(next_page);
});
router.get('/signup', isNotLoggedIn, function (req, res, next) {
    res.render('signup', {title: 'Signup', hide_footer: true});
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});


router.get('/unsubscribe', function (req, res, next) {
    res.render('error', {
        error: {status: 'success', stack: 'You successfully unsubscribed from email notifications.'},
        message: "Successfully Unsubscribed"
    });
});

router.get('/verify', passport.authenticate('jwt', {session: false}), (req, res) => {

});


router.use('/@admin', needsGroup('admin'), require('./admin/index'));

router.use('/podcasts', require('./podcasts/index'));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = {
            displayName: req.user.displayName,
            email: req.user.email

        };
        return next();
    }
    res.redirect('/login');
}

function isNotLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/profile');
    else
        return next();
}

function needsGroup(group) {
    return function (req, res, next) {
        if (req.user && req.user.group === group) {
            res.locals.user = req.user;
            next();
        }
        else {
            req.session.message = "Unauthorized Access";
            res.status(401).redirect(`/login?next=${req.originalUrl}`);
        }
    };
}
