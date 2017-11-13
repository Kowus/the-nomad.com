/*
 * Created by barnabasnomo on 11/12/17 at 12:45 PM
*/
const express = require('express'),
    router = express.Router(),
    Podcast = require('../../models/podcasts')
;

router.get('/', function (req, res, next) {
    res.render('index', {title: 'If User, go to Dashboard'});
});

router.get('/podcasts', function (req, res, next) {
    Podcast.find({}, function (err, podcasts) {
        if(err) return res.send("An error occurred: "+err);
        res.json(podcasts)
    })
});

router.get('/podcasts/create', function (req, res, next) {
    res.render('index', {title: 'Create a Podcast'})
});
router.post('/podcasts/create', function (req, res, next) {
    let newPodcast = new Podcast({
        title: req.body.title,
        subtitle: req.body.subtitle,
        content:{
            url: req.body.url
        },
        categories:req.body.categories,
        take_aways:req.body.take_aways
    });

    newPodcast.save(function (err, podcast) {
        if (err) return res.send('An Error Occurred: '+ err);
        res.json({
            success:true,
            msg: 'Podcast creation success',
            data: podcast
        })
    })
});

module.exports = router;