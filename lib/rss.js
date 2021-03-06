/*
 * the-nomad.com ==> rss
 * Created By barnabasnomo on 1/31/18 at 10:32 PM
 * @soundtrack Diplomatic Immunity - Drake
*/
let Feed = require('feed'),
  async = require('async'),
  fs = require('fs'),
  Promise = require('bluebird'),
  Podcast = require('../models/podcasts');
const itunified = require('./itunes-feed');

let feed = new Feed({
  title: 'The Nomad Podcast',
  description: 'Audible memoirs of a travelling developer',
  id: 'http://www.the-gnomad.com/',
  link: 'http://www.the-gnomad.com',
  image: 'http://www.the-gnomad.com/images/logo.png',
  favicon: 'http://www.the-gnomad.com/favicon.png',
  author: {
    name: 'Barnabas Nomo',
    email: 'barnabas@the-gnomad.com',
    link: 'http://barnabasnomo.com'
  },
  feedLinks: {
    json: 'http://www.the-gnomad.com/feed/podcasts.json',
    atom: 'http://www.the-gnomad.com/feed/podcasts-atom.rss'
  }
});

let createFeed = Promise.promisify(function(done) {
  Podcast.find({}, { 'content.src': 0 })
    .sort({ createdAt: -1 })
    .limit(20)
    .exec(function(err, podcasts) {
      if (err) return done(err);
      feed.options.updated = podcasts[0].updatedOn || podcasts[0].createdAt;
      podcasts.forEach(podcast => {
        feed.addItem({
          title: podcast.title,
          description: podcast.subtitle,
          categories: podcast.categories,
          content: podcast.content.text,
          id: `http://www.the-gnomad.com/podcasts/${podcast.permalink}`,
          link: `http://www.the-gnomad.com/podcasts/${podcast.permalink}`,
          image: podcast.content.banner_picture,
          author: [
            {
              name: 'Barnabas Nomo',
              email: 'barnabas@the-gnomad.com',
              link: 'http://barnabasnomo.com'
            },
            {
              name: podcast.guest.name
            }
          ],
          date: podcast.createdAt
        });
      });

      async.parallel(
        [
          callback => {
            fs.writeFile('./public/feed/podcasts.rss', feed.rss2(), err => {
              if (err) return callback(err);
              callback(null, { rss2: true });
            });
          },
          callback => {
            fs.writeFile(
              './public/feed/podcasts-atom.rss',
              feed.atom1(),
              err => {
                if (err) return callback(err);
                callback(null, { atom1: true });
              }
            );
          },
          callback => {
            fs.writeFile('./public/feed/podcasts.json', feed.json1(), err => {
              if (err) return callback(err);
              callback(null, { json1: true });
            });
          },
          callback => {
            itunified()
              .then(result => {
                callback(null, result);
              })
              .catch(error => {
                callback(error);
              });
          }
        ],
        (err, result) => {
          if (err) return done(err);
          return done(null, result);
        }
      );
    });
});

module.exports = {
  createFeed: createFeed
};
