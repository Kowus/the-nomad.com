/*
 * Created by barnabasnomo on 11/12/17 at 4:23 AM
*/

module.exports ={
    database: {
        url: process.env.MONGODB_URI
    },
    session:{
        secret: process.env.SESSION_SECRET
    }
};