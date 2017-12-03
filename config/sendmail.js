/*
 * the-nomad.com ==> sendmail
 * Created By barnabasnomo on 11/29/17 at 3:42 AM
*/
const Email=require('email-templates'),
    path=require('path'),
    nodemailer = require('nodemailer'),
    env=require('./env')
;
let transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
        user:env.node_mailer.user,
        pass:env.node_mailer.pass

    }
});
const email = new Email({
    message:{
        from:'Barnabas Nomo'
    },
    // send:true,
    transport:transporter,views:{
        options:{
            extension:'handlebars'
        }
    }
});



module.exports={
    sendConfirmation: function (user, token) {
        email.send({
            template:'confirm_account',
            message:{
                to:`${user.displayName} <${user.email}>`
            },
            locals:{
                user:user, token:token
            }
        }).then(console.log).catch(console.error);
    },
    nominate:function (user, nominee) {
        email.send({
            template:'nominate',
            message:{
                to:`${user.name} <${user.email}>`
            },
            locals:{
                user:user, nominee:nominee
            }
        }).then(console.log).catch(console.error);
    }
};