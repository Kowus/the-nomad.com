/*
 * Created by barnabasnomo on 11/12/17 at 6:03 PM
*/
const LocalStrategy = require('passport-local').Strategy,
    mailer = require('./sendmail'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    env = require('./env'),
    jwt = require('jsonwebtoken')
;
let User = require('../models/user');


let opts = {
    audience: env.jwt.audience,
    issuer: env.jwt.issuer,
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
    secretOrKey: env.jwt.key
};

module.exports = function (passport) {
    passport.serializeUser(function (req, user, done) {
        done(null, user.id);
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
                        return done(null, false, req.flash('signupMessage', 'That email has already been used with an account.'));
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
                        newUser.save(function (err, user) {
                            if (err) {
                                console.log(err);
                                return done(null, false, req.flash('signupMessage', "Couldn't create your account."));}
                            jwt.sign({
                                audience: env.jwt.audience,
                                data: {
                                    user: {
                                        _id: user._id,
                                        account_stat: {
                                            confirmation_str: user.account_stat.confirmation_str
                                        }
                                    }
                                },
                                exp: Math.floor(Date.now() / 1000) + (259200),
                                issuer: env.jwt.issuer

                            }, env.jwt.key, (err, token) => {
                                if(err) return console.log(err);
                                mailer.sendConfirmation(user, token);
                            });
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

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({_id: jwt_payload.data._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
};