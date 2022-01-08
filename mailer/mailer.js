//Using gmail smtp transport.
const nodemailer = require('nodemailer')
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")

function createNodeMailerTransport(service, user, pass){
    return nodemailer.createTransport({
        service: service,
        auth: {
            user: user,
            pass: pass
        }
    })
}

function  sendEmail(from, to, subject, header, text, action, text_one, text_two, nodeTransport){
    var template = handleEmailTemplate(text)
    var mailDetails = {
        from: from,
        to: to,
        subject: subject,
        html: template(
            {
                header: header,
                text: text,
                action: action,
                text_one: text_one,
                text_two: text_two,
                regards: 'Regards! GreeniumTrade'
            }
        )
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

function handleEmailTemplate(text) {
    // fs.writeFileSync(path.join('../lib', '/main.hbs'), text)
    var emailTemplateSource = fs.readFileSync(path.join(__dirname,'../lib/email.hbs'), 'utf-8')
    var template = handlebars.compile(emailTemplateSource)
    return template
}

module.exports = {
    createNodeMailerTransport: createNodeMailerTransport,
    sendEmail: sendEmail
}