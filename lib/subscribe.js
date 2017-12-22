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
    Subscriber = require('../models/subscriber')
;

let subscribeUser = Promise.promisify((email, callback) => {
    User.findOneAndUpdate({email: email},
        {
            $set: {
                'account_stat.subscribed': true
            }
        }, function (err, user) {
            if (err) return callback({
                code: 2,
                message: 'An error occurred. Please try again.'
            });
            if (!user) {
                Subscriber.findOne({email:email}, (err, subscriber)=>{
                    if (err) return callback({
                        code: 2,
                        message: 'An error occurred. Please try again.'
                    });
                    if(!subscriber){
                        newSubscriber = new Subscriber({
                            email: req.body.email
                        });
                        newSubscriber.save(err => {
                            if (err) return callback({
                                code: 2,
                                message: 'An error occurred. Please try again.'
                            });
                            return callback(null, {
                                code: 0,
                                message:'Subscription successful, please confirm your account'
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
            } else if (user.account_stat.subscribed) return callback(null, {
                code: 1,
                message: `Your email ${email} is already subscribed.`
            });
            return callback(null, {
                code: 0,
                message:'Subscription successful, please confirm your account'
            });

        });
});

module.exports = {
    subscribe:subscribeUser
};