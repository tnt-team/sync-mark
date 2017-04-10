var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');



router.get('/sendCode', function(req, res, next) {


});


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'tonghe378@gmail.com',
        pass: 'xxx'
    }
});

var mailOptions = {
    from: 'bsspirit ', // sender address
    to: 'xxxxx@163.com', // list of receivers
    subject: '欢迎注册书签同步', // Subject line
    text: '书签同步验证码', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
});