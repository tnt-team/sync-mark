var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var util = require('../utils');
var constant = require('../constant');




router.post('/sendCode', function(req, res, next) {
    var address = req.body.address;
    var code = util.getRandom(6);
    var text = '你的验证码是' + code + ',请不要将此验证码泄露给它人';
    util.sendMail(address, constant.MAIL_RELATED.MAIL_AUTH_SUBJECT, text, function(err, info) {
        if (err) {
            return res.send('验证码发送失败' + err);
        }
        res.send(0);
    })
});

module.exports = router;