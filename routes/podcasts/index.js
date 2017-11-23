/*
 * Created by barnabasnomo on 11/12/17 at 9:56 AM
*/
let express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Podcast = require('../../models/podcasts')
;

router.get('/', function (req, res, next) {
    Podcast.aggregate([
        {$sort: {date: -1}}
    ], function (err, podcasts) {
        if (err) return res.send("An error occurred: " + err);
        /*res.json(podcasts)*/
        res.render('podcasts', {title: "The Nomad Podcasts", podcasts: podcasts});
    });
});
router.get('/:permalink', function (req, res, next) {
    Podcast.findOne({permalink: req.params['permalink']}, function (err, podcast) {
        if (err) return res.send("An error occurred: " + err);
        res.render('single', {title: "The Nomad Podcasts", podcast: podcast});
    })
});
router.post('/play/:_id', function (req, res, next) {
    Podcast.findOneAndUpdate({_id: req.params['_id']}, {
        $inc: {
            "stats.played": 1
        }
    }, function (err, result) {
        if (err)res.end();
        else res.json({curr_played:result.stats.played});
    })
})


module.exports = router;