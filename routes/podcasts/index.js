/*
 * Created by barnabasnomo on 11/12/17 at 9:56 AM
*/
let express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Podcast = require('../../models/podcasts'),
    User = require('../../models/user'),
    Comment = require('../../models/comments'),
    async = require('async'),
    moment = require('moment')
;

router.get('/', function (req, res, next) {
    Podcast.aggregate([
        {$sort: {createdAt: -1}}
    ], function (err, podcasts) {
        if (err) return res.send("An error occurred: " + err);
        res.locals.curr_page = 'podcasts';
        res.render('podcasts', {title: "The Nomad Podcasts", podcasts: podcasts});
    });
});
router.get('/view/:permalink', function (req, res, next) {
    let podcast_comments=[];
    Podcast.findOne({permalink: req.params['permalink']}, function (err, podcast) {
        if (err) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        }
        res.locals.curr_page = 'single';
        // console.log("podcast: ",podcast);

        if (podcast == null) {
            res.locals.message = 'Could not find the requested podcast';
            res.locals.error = req.app.get('env') === 'development' ? {
                status: 404,
                stack: `Requested file ${req.params['permalink']} not found.`
            } : {status: 404, stack: `Requested file ${req.params['permalink']} not found.`};

            // render the error page
            res.status(500);
            res.render('error', {hide_footer: true});
        } else {

            async.forEachOf(podcast.comments, (value, key, callback)=>{
                Comment.findOne({_id:value}, (err, comment)=>{
                    if(err) return callback(err);
                    try{
                        User.findOne({_id:comment.user},{displayName:1, profile_picture:1}, (err, user)=>{
                            if(err) return callback(err);
                            podcast_comments[key] = {
                                _id: comment._id,
                                user: {
                                    _id:user._id,
                                    displayName:user.displayName,
                                    profile_picture:user.profile_picture
                                },
                                content: comment.content,
                                createdAt: moment(new Date(comment.createdAt).toUTCString()).fromNow(),
                                replies: comment.replies
                            };
                        });
                    } catch (e){
                        return callback(e);
                    }
                    callback();
                });
            }, err=>{
                if(err) console.error(err.message);
                res.render('single', {title: "The Nomad Podcasts", podcast: podcast, comments: podcast_comments});
                }
            );




        }
    });
});

router.get('/comment', function (req, res, next) {
    let conf = [];
    Comment.find({}, function (err, comments) {
        async.forEachOf(comments, (value, key, callback) => {
            User.findOne({_id: value.user}, function (err, user) {
                if (err) return callback(err);
                try {
                    conf[key] = {
                        _id: value._id,
                        user: user.displayName,
                        content: value.content,
                        createdAt: moment(new Date(value.createdAt).toUTCString()).fromNow(),
                        replies: value.replies
                    };

                } catch (e) {
                    return callback(e);
                }
                callback();
            });

        }, err => {
            if (err) console.error(err.message);
            res.json(conf);
        });
    });
});

router.post('/play', function (req, res, next) {
    Podcast.findOneAndUpdate({_id: req.body['_id']}, {
        $inc: {
            "stats.played": 1
        }
    }, function (err, result) {
        if (err) res.end();
        else res.json({curr_played: result.stats.played + 1});
    });
});
router.post('/comment', isLoggedIn, function (req, res, next) {
    let newComment = new Comment({
        user: req.user._id,
        podcast: req.body.podcast,
        content: req.body.comment,
        isReply: false
    });

    newComment.save(function (err, comment) {
        if (err) return res.status(404).json(err);
        let id = comment._id;
        User.findOneAndUpdate({_id: comment.user}, {
            $push: {
                comments: {
                    $position: 0,
                    $each: [comment._id]
                }
            }
        }, function (err, user) {
            if (err) return res.status(404).json(err);
            Podcast.findOneAndUpdate({_id: comment.podcast}, {
                $push: {
                    comments: {
                        $position: 0,
                        $each: [comment._id]
                    }
                }
            }, function (err, podcast) {
                if (err) return res.status(404).json(err);
                else return res.json({
                    status: 200,
                    msg: "OK"
                });
            });
        });
    });


});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
