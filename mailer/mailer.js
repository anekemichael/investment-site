//Using gmail smtp transport.
const nodemailer = require('nodemailer')

function createNodeMailerTransport(service, user, pass){
    return nodemailer.createTransport({
        service: service,
        auth: {
            user: user,
            pass: pass
        }
    })
}

function sendEmail(from, to, subject, text, nodeTransport){
    var mailDetails = {
        from: from,
        to: to,
        subject: subject,
        text: text
    }
    nodeTransport.verify(function (error, succes){
        if(error){
            console.log(error);
        } else {
            nodeTransport.sendMail(mailDetails, function(err, data) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
        }
    })
}

module.exports = {
    createNodeMailerTransport: createNodeMailerTransport,
    sendEmail: sendEmail
}