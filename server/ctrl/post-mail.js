var path = require('path'),
    config = require('../config.js'),
    sendEmail = require(path.join(config.API_DIR,'sendEmail.js'));

module.exports = function (req, res) {

    var emailto = req.body.emailto;
    var websitename = req.body.websitename;
    var formName = req.body.formName;
    var formEmail = req.body.formEmail;
    var formSubject = req.body.formSubject;
    var formMessage = req.body.formMessage;

    function sendEmailError(err) {
        console.error(err);
        return res.status(500).send('Impossible to send mail :' + err);
    }

    function sendEmailSuccess(message) {
        console.log(message);
        res.status(200).send('Email sent ' + message);
    }

    return sendEmail.send(sendEmailError, emailto, websitename, formName, formEmail, formSubject, formMessage, sendEmailSuccess);

};