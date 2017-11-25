/*
 * Created by barnabasnomo on 11/12/17 at 4:23 AM
*/

module.exports ={
    database: {
        url: process.env.MONGODB_URI
    },
    session:{
        secret: process.env.SESSION_SECRET
    },
    aws:{
        key:process.env.AWS_KEY_ID,
        bucket:process.env.AWS_BUCKET,
        secret:process.env.AWS_SECRET_ACCESS_KEY
    }
};