/*
 * the-nomad.com ==> subscribe
 * Created By barnabasnomo on 12/22/17 at 10:07 PM
 * @soundtrack Worst Behaviour - Drake
*/

/*
* Check if user is already subscribed
* if subscribed send 1
* else subscribe user and send 0
 */

const User = require('../models/user'),
    Promise = require('bluebird'),
    Subscriber = require('../models/subscriber'),
    request = require('request'),
    env = require('../config/env')
;

// email, callback

let subscribeUser = Promise.promisify((fname, lname, email, callback) => {
    /*User.findOneAndUpdate({email: email},
        {
            $set: {
                'account_stat.subscribed': true
            }
        }, function (err, user) {
            if (err) return callback({
                code: 2,
                message: 'An error occurred. Please try again.'
            });
            // User doesn't exist
            if (!user) {
                Subscriber.findOne({email:email}, (err, subscriber)=>{
                    if (err) return callback({
                        code: 2,
                        message: 'An error occurred. Please try again.'
                    });
                    if(!subscriber){
                        newSubscriber = new Subscriber({
                            email: email
                        });
                        newSubscriber.save(err => {
                            if (err) return callback({
                                code: 2,
                                message: 'An error occurred. Please try again.'
                            });
                            return callback(null, {
                                code: 0,
                                message:'Subscription successful, please confirm your account.'
                            })
                        });
                    }
                    else {
                        return callback(null, {
                            code: 1,
                            message: `Your email ${email} is already subscribed.`
                        });
                    }

                });
            } else{
                if (user.account_stat.subscribed) return callback(null, {
                    code: 1,
                    message: `Your email ${email} is already subscribed.`
                });

                return callback(null, {
                    code: 0,
                    message: 'Subscription successful, please confirm your account.'
                });
            }

        });*/
    request({
            url: `https://anystring:${env.mail_chimp.key}@us17.api.mailchimp.com/3.0/lists/${env.mail_chimp.nomad}/members/`,
            method: 'POST',
            json: {
                "email_address": email,
                "status": "subscribed",
                "merge_fields": {
                    "FNAME": fname,
                    "LNAME": lname
                }

            }
        },
        function (err, httpResponse, body) {
            if (err) {
                console.error(err);
                return callback({
                    code: 2,
                    message: 'An error occurred. Please try again.'
                });
            }
            console.log(body);
            if (body.title === 'Member Exists') {
                return callback(null, {
                    code: 1,
                    message: `Your email ${email} is already subscribed.`
                });
            } else {
                return callback(null, {
                    code: 0,
                    message: 'Subscription successful, please check your inbox for confirmation.'
                });
            }
        }
    );
});

module.exports = {
    collection: Subscriber.collection.name,
    subscribe: subscribeUser
};

// Responses to add
/*
 * Invalid Domain
 * Invalid Username
 */