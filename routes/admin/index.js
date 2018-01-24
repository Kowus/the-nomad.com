/*
 * Created by barnabasnomo on 11/12/17 at 12:45 PM
*/
var express = require('express'),
    router = express.Router(),
    Podcast = require('../../models/podcasts'),
    Season = require('../../models/season'),
    multipart = require('connect-multiparty'),
    AWS = require('aws-sdk'),
    env = require('../../config/env'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    path = require('path'),
    sitemap = require('../../lib/sitemap')
;

AWS.config.update({
    accessKeyId: env.aws.key,
    secretAccessKey: env.aws.secret
});

router.use('/upload', multipart());


router.get('/', function (req, res, next) {
    res.render('index', {title: 'If User, go to Dashboard'});
});

router.get('/podcasts', function (req, res, next) {
    Podcast.find({}, {_id: 0, title: 1, permalink: 1, 'content.banner_picture':1}).sort({createdAt:-1}).exec(function (err, podcasts) {
        if (err) return res.send('An Error Occured: ' + err);
        res.render('update-dash', {podcasts: podcasts});
    });
});

router.get('/podcasts/create', function (req, res, next) {
    res.render('create-podcast', {title: 'Create a Podcast'});
});

router.get('/podcasts/:permalink', function (req, res, next) {
    Podcast.findOne({permalink: req.params.permalink}).exec(function (err, podcast) {
        if (err) return res.send('An Error Occured: ' + err);
        res.render('update-podcast', {podcast: podcast});
    });
});

router.post('/podcasts/create', function (req, res, next) {
    let newPodcast = new Podcast({
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: {
            src: req.body.src,
            text: req.body.text,
            banner_picture: req.body.banner_picture
        },
        categories: req.body.categories,
        take_aways: req.body.take_aways,
        guest: {
            name: req.body.guest_name,
            company: req.body.guest_company,
            position: req.body.guest_position,
            about: req.body.guest_about
        },
        no: Number(req.body.episode),
        episode: Number(req.body.episode),
        season: req.body.season
    });
    newPodcast.save(function (err, podcast) {
        if (err) return res.send('An Error Occurred: ' + err);
        sitemap.createSitemapXML()
            .then(response => {
                res.json({
                    success: true,
                    msg: 'Podcast creation success',
                    data: podcast
                });
            }).catch(err => {
            res.json({
                success: true,
                msg: 'Podcast creation success, but there was an error generating the sitemap',
                data: podcast
            });
        });
    });
});

router.post('/podcasts/update', function (req, res, next) {
    Podcast.findOneAndUpdate({_id: req.body._id}, {
        $set: {
            title: req.body.title,
            subtitle: req.body.subtitle,
            content: {
                src: req.body.src,
                text: req.body.text,
                banner_picture: req.body.banner_picture
            },
            categories: req.body.categories,
            take_aways: req.body.take_aways,
            guest: {
                name: req.body.guest_name,
                company: req.body.guest_company,
                position: req.body.guest_position,
                about: req.body.guest_about
            },
            no: Number(req.body.episode),
            episode: Number(req.body.episode),
            season: req.body.season,
            updatedOn: new Date().toISOString()
        }
    }, (err, podcast) => {
        if (err) return res.send('An Error Occurred: ' + err);
        sitemap.createSitemapXML().then(response => {
            res.render('error', {
                message: 'Success',
                error: {
                    status: 200,
                    stack: `Successfully updated podcast: ${podcast.title}`
                }
            });
        }).catch(err => {
            res.send('Error.');
        });
    });
});

router.get('/blog/create', function (req, res, next) {
    res.render('new-blog', {title: 'Create a Blog', tiny_mce: env.tiny_mce.key});
});
router.post('/upload/:file_type', function (req, res, next) {
    let file_type = req.params['file_type'];
    fs.readFile(req.files[file_type].path, function (err, data) {
        let options = {queueSize: 1},
            base64data = new Buffer.from(data, 'binary'),
            s3 = new AWS.S3();
        s3.upload({
            Bucket: env.aws.bucket,
            Key: `${file_type}/${req.files[file_type].name}`,
            Body: base64data,
            ACL: 'public-read'
        }, options, function (err, data) {
            if (err) {
                console.log(err);
                return res.status(err.code).send(err);
            }
            rimraf(path.dirname(req.files[file_type].path), function () {
                console.log("Deleted temporary server files after upload");
            });
            res.json({data, file_type: file_type});
        });
    });


});
module.exports = router;