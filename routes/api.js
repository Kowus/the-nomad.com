/*
 * the-nomad.com ==> api
 * Created By barnabasnomo on 1/5/18 at 12:33 PM
 * @soundtrack Alive - Sia
*/

var express = require('express'),
    router = express.Router(),
    Podcast = require('../models/podcasts'),
    Season = require('../models/season')
;

router.get('/seasons', function (req, res, next) {
    let queries = req.query['q'].split('+'),
        fields = {}
    ;
    queries.forEach((item) => {
        let currentField = item.split(':');
        fields[currentField[0]] = new RegExp(currentField[1], 'i');
    });
    Season.find(fields).exec(function (err, seasons) {
        if(err) return res.send(err);
        res.json(seasons);
    })
});

module.exports = router;