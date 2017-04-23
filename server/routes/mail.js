var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var util = require('../utils');
var dao_user = require('../dao/users');
var constant = require('../constant');




router.post('/sendCode', function(req, res, next) {
    var address = req.body.address;
    var code = util.getRandom(6);
    var text = '你的验证码是' + code + ',请不要将此验证码泄露给他人';

    dao_user.saveMailCode(address, code, function(err) {
        if (err) {
            console.error('邮件保存失败！' + err);
            return res.json({ 'code': -1, 'data': '邮件保存失败，请重试' });
        }
        util.sendMail(address, constant.MAIL_RELATED.MAIL_AUTH_SUBJECT, text, function(err, info) {
            if (err) {
                console.log('发送邮件有误' + err);
                //TODO 重发机制
            }
            console.log('邮件发送成功！');
        });
        res.json({ 'code': 0, 'data': '邮件已发送，请注意查收' });
    });

});

module.exports = router;