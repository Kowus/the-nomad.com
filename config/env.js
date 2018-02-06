/*
 * Created by barnabasnomo on 11/12/17 at 4:23 AM
*/

module.exports = {
    database: {
        url: process.env.MONGODB_URI
    },
    session: {
        secret: process.env.SESSION_SECRET
    },
    aws: {
        key: process.env.AWS_KEY_ID,
        bucket: process.env.AWS_BUCKET,
        secret: process.env.AWS_SECRET_ACCESS_KEY
    },
    tiny_mce: {
        key: process.env.TINY_MCE_API_KEY
    },
    mail_chimp:{
        key:process.env.MAIL_CHIMP_KEY,
        nomad:process.env.MAIL_CHIMP_SUBSCRIBERS_NOMAD
    },
    node_mailer: {
        user: process.env.NODE_MAILER_AUTH_EMAIL,
        pass: process.env.NODE_MAILER_AUTH_PASSWORD
    },
    jwt:{
        key: process.env.JWT_KEY,
        issuer: process.env.JWT_ISSUER,
        audience:process.env.JWT_AUDIENCE
    },
    redis:{
        url: process.env.REDIS_URL
    }
};