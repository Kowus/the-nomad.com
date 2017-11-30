/*
 * Created by barnabasnomo on 11/12/17 at 6:03 PM
*/
const LocalStrategy = require('passport-local').Strategy,
    mailer = require('./sendmail')
;
let User = require('../models/user');

module.exports = function (passport) {
    passport.serializeUser(function (req, user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function (req, id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            // async. User.findOne() won't fire until data is sent back
            process.nextTick(function () {
                //	Check to see if there's already a record of user
                User.findOne({email: email}, function (err, user) {
                    if (err) return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email has already been used with an account.'))
                    } else {
                        //	User doesn't already exist
                        //	Create User
                        let newUser = new User({
                            given_name: req.body.given_name,
                            family_name: req.body.family_name,
                            email: req.body.email,
                            password: req.body.password
                        });


                        //	save the user
                        newUser.save(function (err,user) {
                            if (err) throw err;
                            mailer.sendConfirmation(user,'This Is a moCk toKen.')
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            //	If user exists
            User.findOne({email: email.toLowerCase()}, function (err, user) {
                if (err) return done(err);
                //	If user doesn't exist
                if (!user) return done(null, false, req.flash('loginMessage', 'No user found'));

                //	If user found but password is wrong
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false, req.flash('loginMessage', 'Email or Password incorrect'));
                    }
                });

            });
        }
    ));


};