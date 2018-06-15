/*
 * the-nomad.com ==> itunes-feed
 * Created By barnabasnomo on 6/14/18 at 11:32 PM
 * @soundtrack Blem - Drake
*/
const Podcast = require('podcast');
const { waterfall } = require('async');
const { promisify } = require('bluebird');
const { writeFile } = require('fs');
const Podcasts = require('../models/podcasts');

const feed = new Podcast({
  title: 'The Nomad Podcast',
  description: 'Audible memoirs of a travelling developer',
  site_url: 'https://the-gnomad.com',
  image_url: 'http://www.the-gnomad.com/images/src/water-gaze-itunes.jpg',
  author: 'Barnabas Nomo',
  managingEditor: 'Barnabas Nomo',
  webMaster: 'Barnabas Nomo',
  copyright: '2018 Barnabas Nomo',
  language: 'en',
  ttl: 1440,
  itunesAuthor: 'Barnabas Nomo',
  itunesSubtitle: 'Audible memoirs of a travelling developer',
  itunesSummary:
    'My friends started calling me The Nomad because I would travel all over Ghana from makerspace to makerspace just to talk to developers to gather ideas and perspectives. I figured the Tech Atmosphere in Ghana is greatly advancing. And at the heart of this advancement is the magical, intimate revelations of the youth. But this driving force is greatly sabotaged by Self Doubt, Little Support, Fewer Known Mentors, and the Lack of an Active Tech Community. So I started this podcast to provide connectivity, advice, a chance to learn, and a platform for others to showcase what they know',
  itunesOwner: { name: 'Barnabas Nomo', email: 'barnabas@the-gnomad.com' },
  itunesExplicit: false,
  itunesCategory: {
    text: 'Technology'
  },
  itunesImage: 'https://www.the-gnomad.com/images/src/water-gaze-itunes.jpg'
});

const itunify = promisify(done => {
  waterfall(
    [
      cb => {
        Podcasts.find({})
          .sort({ createdAt: -1 })
          .limit(20)
          .exec((err, podcasts) => {
            if (err) return cb(err);
            cb(null, podcasts);
          });
      },
      (podcasts, cb) => {
        podcasts.forEach(podcast => {
          feed.addItem({
            title: podcast.title,
            description: podcast.content.text,
            enclosure: {
              url: podcast.content.src
            },
            content: podcast.content.text,
            url: `http://www.the-gnomad.com/podcasts/${podcast.permalink}`,
            categories: podcast.categories,
            author: podcast.guest.name,
            date: podcast.createdAt,
            itunesAuthor: podcast.guest.name,
            itunesExplicit: false,
            itunesSummary: podcast.subtitle,
            itunesImage: podcast.content.banner_picture,
            itunesEpisode: podcast.episode
          });
        });
        try {
          const xml = feed.buildXml(' ');
          return cb(null, xml);
        } catch (error) {
          return cb(error);
        }
      }
    ],
    (err, result) => {
      if (err) return done(err);
      writeFile('./public/feed/podcasts.xml', result, err => {
        if (err) return done(err);
        return done(null, { itunes: true });
      });
    }
  );
});

module.exports = itunify;
