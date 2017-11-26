let sm = require('sitemap');
let Podcast = require('../models/podcasts');


let sitemap = sm.createSitemap({
    hostname: 'https://the-nomad.com',
    cacheTime: 600000
});


function addToSitemap(podcast) {
    sitemap.add({url: `/podcasts/view/${podcast.permalink}`});
}

Podcast.find({}, function (err, podcast) {
    if (err) console.error('could not get podcasts');
    podcast.map(addToSitemap);
});

module.exports = sitemap;