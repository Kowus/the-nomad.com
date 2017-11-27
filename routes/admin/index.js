/*
 * Created by barnabasnomo on 11/12/17 at 12:45 PM
*/
var express = require('express'),
    router = express.Router(),
    Podcast = require('../../models/podcasts'),
    multipart = require('connect-multiparty'),
    AWS = require('aws-sdk'),
    env = require('../../config/env'),
    fs =require('fs'),
    rimraf = require('rimraf'),
    path = require('path')
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
    Podcast.find({}, function (err, podcasts) {
        if (err) return res.send("An error occurred: " + err);
        res.json(podcasts);
    });
});

router.get('/podcasts/create', function (req, res, next) {
    res.render('create-podcast', {title: 'Create a Podcast'});
});
router.post('/podcasts/create', function (req, res, next) {
    Podcast.count({}, function (err, count) {
        if (err) return res.send('err');
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
            no: Number(count) + 1 || 0
        });
        newPodcast.save(function (err, podcast) {
            if (err) return res.send('An Error Occurred: ' + err);
            res.json({
                success: true,
                msg: 'Podcast creation success',
                data: podcast
            });
        });
    });
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
            rimraf(path.dirname(req.files[file_type].path),function () {
                console.log("Deleted temporary server files after upload")
            });
            res.json({data, file_type: file_type});
        });
    });


});
module.exports = router;