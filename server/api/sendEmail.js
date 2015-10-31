var nodemailer = require("nodemailer");
var CONFIG = require("../config.js");

function sendMail() {
    var transporter = nodemailer.createTransport({
        service: CONFIG.SERVICE,
        auth: {
            user: CONFIG.USER,
            pass: CONFIG.PASSWORD
        }
    });

    this.send = function(err, pEmailto, pWebsitename, pName, pEmail, pSubject, pMessage, callback) {
        if (pEmailto != "" && pWebsitename != "" && pName != "" && pEmail != "" && pSubject != "" && pMessage != "") {
            console.log("Sending message : " + pEmailto + ":" + pWebsitename + ":" + pName + ":" + pEmail + ":" + pSubject);
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: pEmail, // sender address
                to: pEmailto, // list of receivers
                subject: "[" + pWebsitename + "]:From " + pEmail + ":" + pSubject, // Subject line
                text: "From :" + pName + "<" + pEmail + ">" + " :\n" + "Subject : " + pSubject + "\n"+ pMessage, // plaintext body
                html:   "From : <a emailto='" + pEmail + "'>"+ pEmail + "</a>"
                        +  "<h2>Subject : " + pSubject + "</h2>"
                        + "<p>" + pMessage +"</p>" // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return err(error);
                } else {
                    return callback(info.response);
                }
            });
        } else {
            return err("Missing arguments");
        }
    };
};

module.exports = new sendMail();
