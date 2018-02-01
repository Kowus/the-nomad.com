/*
 * the-nomad.com ==> rss
 * Created By barnabasnomo on 1/31/18 at 10:32 PM
 * @soundtrack Diplomatic Immunity - Drake
*/
const Feed = require('feed');
let feed = new Feed({
    title: 'The GNomad Podcast',
    description:'Audible memoirs of a travelling developer',
    id:'http://the-gnomad.com/',
    link:'http://the-gnomad.com',
    image:'http://the-gnomad.com/images/logo.png',
    favicon:'http://the-gnomad.com/favicon.png',
    author: {
        name: 'Barnabas Nomo',
        email: 'barnabas@the-gnomad.com',
        link:'http://barnabasnomo.com'
    }
});

