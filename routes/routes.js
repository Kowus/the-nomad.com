let express = require('express'),
    router = express.Router(),
    passport = require('passport')
;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'The Nomad'});
});

router.get('/login',isNotLoggedIn, function (req, res, next) {
    res.render('index', {title: 'Login'})
});

router.post('/login', passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));


router.get('/signup',isNotLoggedIn, function (req, res, next) {
    res.render('index', {title: 'Signup'})
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
