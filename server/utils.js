var nodemailer = require('nodemailer');
var crypto = require('crypto');
var constant = require('./constant');

function result2json(res, result) {
    packRes(res);
    res.json({ "result": result });
}

function error2json(res, err) {
    packRes(res);
    res.json({ "error": err });
}

function redirect(res, page) {
    packRes(res);
    res.redirect(page);
}

function packRes(res) {
    res.setHeader('Access-Control-Allow-origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Credentials', true);
}

function sendMail(to, subject, text, callback) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tonghe378@gmail.com',
            pass: 'wth19920121'
        }
    });
    var mailOptions = {
        from: 'tonghe378@gmail.com', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plaintext body
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            return callback(err);
        }
        callback(null, info);
    });
}

/**
 * 生成num个随机数
 * @param {*生成随机数个数} num 
 */
function getRandom(num) {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var length = chars.length - 1;
    var str = '';
    for (var i = 0; i < num; i++) {
        var s = chars[Math.floor(Math.random() * (length + 1))];
        str += s;
    }
    return str;

}

/**
 * 将用户名设置到cookie
 * @param {*} res 
 * @param {*用户名} name 
 */
function setUser2Cookie(res, name) {
    res.cookie(constant.COOKIE_RELATED.COOKIE_USER_ID, name, {
        httpOnly: true,
        maxAge: constant.COOKIE_RELATED.COOKIE_STORAGE_TIME,
        signed: true
    });
}

/**
 * 从cookie中获取用户名，若无，返回null
 * @param {*} req 
 */
function getUserFromCookie(req) {
    var name = req.signedCookies[constant.COOKIE_RELATED.COOKIE_USER_ID];
    return name;
}

function encryptSHA1(value) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(value);
    return sha1.digest('hex');
}
module.exports = {
    result2json,
    error2json,
    redirect,
    sendMail,
    getRandom,
    encryptSHA1,
    setUser2Cookie,
    getUserFromCookie
}