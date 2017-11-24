let express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Podcast = require('../models/podcasts')
;

/* GET home page. */
router.get('/', function (req, res, next) {
    Podcast.aggregate(
        [
            {$sort:{date:-1} },
            {$limit: 3}
        ], function (err, podcasts) {
            if (err) return res.send("An error occurred: " + err);
            /*res.json(podcasts)*/
            res.render('index', {title: "The Nomad", podcasts: podcasts,user:req.user||null});
        });
});

router.get('/login', isNotLoggedIn, function (req, res, next) {
    res.render('login', {title: 'Login', hide_footer:true})
});

router.post('/login',isNotLoggedIn, passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile', isLoggedIn, function (req, res, next) {
    if(req.user.group ==='admin'){
        res.send('redirect to admin')
    } else {
        res.send('redirect to user')
    }

});

router.get('/signup', isNotLoggedIn, function (req, res, next) {
    res.render('signup', {title: 'Signup', hide_footer:true})
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/@admin', needsGroup('admin'), require('./admin/index'));

router.use('/podcasts', require('./podcasts/index'));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
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
        if (req.user && req.user.group === group)
            next();
        else
            res.status(401).send('Unauthorized');
    };
}
