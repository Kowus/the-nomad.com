/*
 * Created by barnabasnomo on 11/12/17 at 9:56 AM
*/
let express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Podcast = require('../../models/podcasts'),
    User = require('../../models/user'),
    Comment = require('../../models/comments')
;

router.get('/', function (req, res, next) {
    Podcast.aggregate([
        {$sort: {date: -1}}
    ], function (err, podcasts) {
        if (err) return res.send("An error occurred: " + err);
        res.render('podcasts', {title: "The Nomad Podcasts", podcasts: podcasts});
    });
});
router.get('/view/:permalink', function (req, res, next) {
    Podcast.findOne({permalink: req.params['permalink']}, function (err, podcast) {
        if (err) return res.send("An error occurred: " + err);
        /*podcast.comments.forEach(function (item) {
            Comment.findOne({_id:item},function (err, comm) {
                if(err) return console.error(err);
                User.findOne({_id:comm.user},{displayName:1},function (err, user) {
                    if(err) return console.error(err);
                    comm.username = user.displayName;
                    console.log(comm)
                });

            })
        });*/
        res.render('single', {title: "The Nomad Podcasts", podcast: podcast, user: req.user || null});

    })
});
router.get('/comment', function (req, res, next) {
    Comment.findOne({_id:req.query['obj_id']},function (err, comment) {
        if (err) return res.send("An error occurred: " + err);
        User.findOne({_id:comment.user},{displayName:1},function (err, user) {
            if (err) return res.send("An error occurred: " + err);
            res.json({comment: {
                _id:comment._id,
                user:user,
                content:comment.content,
                createdAt:comment.createdAt
            }});
        })
    })
});
router.post('/play', function (req, res, next) {
    Podcast.findOneAndUpdate({_id: req.body['_id']}, {
        $inc: {
            "stats.played": 1
        }
    }, function (err, result) {
        if (err) res.end();
        else res.json({curr_played: result.stats.played + 1});
    })
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
