/*
 * the-nomad.com ==> sitemap
 * Created By barnabasnomo on 12/27/17 at 9:09 PM
*/
const sm = require('sitemap'),
    Promise = require('bluebird'),
    Podcast = require('../models/podcasts'),
    Blog = require('../models/blog'),
    async = require('async'),
    fs = require('fs'),
    moment = require('moment')
;

let sitemap = sm.createSitemap({
    hostname: 'https://the-gnomad.com',
    cacheTime: 600000,
    urls: [
        {url: '/', changefreq: 'weekly', priority: 1},
        {url: '/login'},
        {url: '/signup'},
        {url: '/podcasts', changefreq: 'weekly', priority: 0.7},
        {url: '/blogs', changefreq: 'weekly', priority: 0.7},
    ]
});


let createSitemapXML = Promise.promisify(function (done) {
    async.parallel([
        function (callback) {
            Podcast.find({}, {permalink: 1,_id:0,updatedOn:1},function (err, podcasts) {
                if(err) return callback(err);
                addToSitemap(podcasts,'/podcasts/');
                callback();
            })
        },
        function (callback) {
            Blog.find({}, {permalink: 1,_id:0,updatedOn:1},function (err, blogs) {
                if(err) return callback(err);
                addToSitemap(blogs,'/blogs/');
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
                    return done(null, 'Successfully Generated sitemap.XML File.');
                });
            });
        }
    )
});

function addToSitemap(object, route) {
    object.forEach(entry=>{
        sitemap.add({url: `${route}/${entry.permalink}`,changefreq:'weekly', lastmod:moment(new Date(entry.updatedOn).toUTCString()).format('YYYY-MM-DD')})
    });
}

module.exports = {
    createSitemapXML: createSitemapXML
};