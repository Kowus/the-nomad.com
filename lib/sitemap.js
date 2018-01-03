/*
 * the-nomad.com ==> sitemap
 * Created By barnabasnomo on 12/27/17 at 9:09 PM
*/
const sm = require('sitemap'),
    Promise = require('bluebird'),
    Podcast = require('../models/podcasts'),
    Blog = require('../models/blog'),
    async = require('async'),
    fs = require('fs')
;

let sitemap = sm.createSitemap({
    hostname: 'https://the-nomad.com',
    cacheTime: 600000,
    urls: [
        {url: '/', changefreq: 'weekly', priority: 0.3},
        {url: '/login'},
        {url: '/signup'},
        {url: '/podcasts', changefreq: 'weekly', priority: 0.7},
        {url: '/blogs', changefreq: 'weekly', priority: 0.7},
    ]
});


let createSitemapXML = Promise.promisify(function (done) {
    async.parallel([
        function (callback) {
            Podcast.find({}, {permalink: 1,_id:0},function (err, podcasts) {
                if(err) return callback(err);
                addToSitemap(podcasts,'/podcasts/view');
                callback();
            })
        },
        function (callback) {
            Blog.find({}, {permalink: 1,_id:0},function (err, blogs) {
                if(err) return callback(err);
                addToSitemap(blogs,'/blogs/view');
                callback();
            })
        }], (err, result) => {
            if (err) {
                console.error(err.message);
                return done(err);
            }
            sitemap.toXML(function (err, xml) {
                if (err) {
                    return done(err);
                }
                fs.writeFile('./public/sitemap.xml', xml, err => {
                    if (err) done(err);
                    return done(null, 'Successfully Generated XML File.');
                });
            });
        }
    )
});

function addToSitemap(object, route) {
    object.forEach(entry=>{
        sitemap.add({url: `${route}/${entry.permalink}`})
    });
}

module.exports = {
    createSitemapXML: createSitemapXML
};