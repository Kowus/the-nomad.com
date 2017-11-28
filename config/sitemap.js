let express = require('express');
let router = express.Router();
let sm = require('sitemap');
let Podcast = require('../models/podcasts');

let sitemap = sm.createSitemap({
    hostname: 'https://the-nomad.com',
    cacheTime: 600000,
    urls: [
        {url: '/', changefreq: 'weekly', priority: 0.3},
        {url: '/podcasts', changefreq: 'weekly', priority: 0.7}
    ]
});


function addToSitemap(podcast) {
    sitemap.add({url: `/podcasts/view/${podcast.permalink}`});
}


router.get('/', function (req, res, next) {
    Podcast.find({},{permalink:1,_id:0}, function (err, podcast) {
        if (err) console.error('could not get podcasts');
        podcast.map(addToSitemap);

        sitemap.toXML(function (err, xml) {
            if (err) {
                return res.status(500).end();
            }
            res.header('Content-Type', 'application/xml');
            res.send(xml);
        });
    });
});
module.exports = router;
