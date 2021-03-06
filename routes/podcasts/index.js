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
  moment = require('moment');

router.get('/', function(req, res, next) {
  Podcast.aggregate([{ $sort: { createdAt: -1 } }], function(err, podcasts) {
    if (err) return res.send('An error occurred: ' + err);
    res.locals.curr_page = 'podcasts';
    res.render('podcasts', { title: 'The Nomad Podcasts', podcasts: podcasts });
  });
});
router.get('/:permalink', function(req, res, next) {
  Podcast.findOneAndUpdate(
    { permalink: req.params['permalink'] },
    {
      $inc: {
        'stats.views': 1
      }
    }
  )
    .lean()
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'email displayName profile_picture'
        },
        {
          path: 'replies',
          populate: { path: 'user', select: 'displayName' }
        }
      ]
    })
    .exec((err, podcast) => {
      if (err) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
      }
      res.locals.curr_page = 'single';

      if (podcast === null) {
        res.locals.message = 'Could not find the requested podcast';
        res.locals.error =
          req.app.get('env') === 'development'
            ? {
                status: 404,
                stack: `Requested file ${req.params['permalink']} not found.`
              }
            : {
                status: 404,
                stack: `Requested file ${req.params['permalink']} not found.`
              };

        // render the error page
        res.status(404);
        res.render('error', { hide_footer: true });
      } else {
        // console.log(podcast);
        podcast.stats.views += 1;
        res.render('single', {
          title: podcast.title,
          description: podcast.subtitle,
          keywords: podcast.categories,
          podcast: podcast
        });
      }
    });
});

router.post('/play', function(req, res, next) {
  Podcast.findOneAndUpdate(
    { _id: req.body['_id'] },
    {
      $inc: {
        'stats.played': 1
      }
    },
    function(err, result) {
      if (err) res.end();
      else res.json({ curr_played: result.stats.played + 1 });
    }
  );
});
router.post('/comment', isLoggedIn, function(req, res, next) {
  let newComment = new Comment({
    user: req.user._id,
    podcast: req.body.podcast,
    content: req.body.comment,
    isReply: false
  });

  newComment.save(function(err, comment) {
    if (err) return res.status(404).json(err);
    User.findOneAndUpdate(
      { _id: comment.user },
      {
        $push: {
          comments: {
            $position: 0,
            $each: [comment._id]
          }
        }
      },
      function(err, user) {
        if (err) return res.status(404).json(err);
        Podcast.findOneAndUpdate(
          { _id: comment.podcast },
          {
            $push: {
              comments: {
                $each: [comment._id]
              }
            }
          },
          function(err, podcast) {
            if (err) return res.status(404).json(err);
            else
              return res.json({
                _id: comment._id,
                status: 200,
                msg: 'OK',
                user: {
                  displayName: req.user.displayName,
                  profile_picture: req.user.profile_picture
                },
                content: req.body.comment,
                createdAt: moment(
                  new Date(comment.createdAt).toUTCString()
                ).fromNow()
              });
          }
        );
      }
    );
  });
});

router.post('/reply', isLoggedIn, function(req, res, next) {
  let newReply = new Comment({
    user: req.user._id,
    podcast: req.body.podcast,
    content: req.body.content,
    isReply: true,
    replyTo: req.body.comment_id
  });
  newReply.save((err, reply) => {
    if (err) return res.status(404).json(err);
    User.findOneAndUpdate(
      { _id: reply.user },
      {
        $push: {
          comments: {
            $position: 0,
            $each: [reply._id]
          }
        }
      },
      err => {
        if (err) return res.status(404).json(err);
        Comment.findOneAndUpdate(
          { _id: req.body.comment_id },
          {
            $push: {
              replies: {
                $each: [reply._id]
              }
            }
          },
          err => {
            if (err) return res.status(404).json(err);
            else
              return res.json({
                status: 200,
                msg: 'OK',
                user: {
                  displayName: req.user.displayName,
                  profile_picture: req.user.profile_picture
                },
                content: reply.content,
                createdAt: moment(
                  new Date(reply.createdAt).toUTCString()
                ).fromNow()
              });
          }
        );
      }
    );
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
