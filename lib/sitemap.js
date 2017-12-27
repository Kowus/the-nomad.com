/*
 * the-nomad.com ==> sitemap
 * Created By barnabasnomo on 12/27/17 at 9:09 PM
*/
const sm = require('sitemap'),
    Promise = require('bluebird'),
    Podcast = require('../models/podcasts'),
    async = require('async')
;

let sitemap = sm.createSitemap({
    hostname: 'https://the-nomad.com',
    cacheTime: 600000,
    urls: [
        {url: '/', changefreq: 'weekly', priority: 0.3},
        {url: '/podcasts', changefreq: 'weekly', priority: 0.7}
    ]
});


let createSitemapXML = Promise.promisify(function (done) {
    Podcast.find({}, {permalink: 1, _id: 0}, function (err, podcasts) {
            if (err) return callback(err);
            async.forEachOf(podcasts, (value, key, callback) => {
                try {
                    addToSitemap(value.permalink);
                } catch (e) {
                    return callback(e);
                }
                callback();
            });
        }, err => {
            if (err) {
                console.error(err.message);
                return done(err);
            }
            sitemap.toXML(function (err, xml) {
                if (err) {
                    return done(err);
                }
                fs.writeFile('../public/sitemap.xml',xml,err=>{
                    if (err) done(err);
                    return done(null,'Successfully Generated XML File.')
                })
            })
        }
    );
});


function addToSitemap(link) {
    sitemap.add({url: link});
}

module.exports = {
    createSitemapXML:createSitemapXML
}