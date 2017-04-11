var nodemailer = require('nodemailer');

function result2json(res, result) {
    packRes(res);
    res.json({ "result": result });
}

function error2json(res, err) {
    packRes(res);
    res.json({ "error": err });
}

function packRes(res) {
    res.setHeader('Access-Control-Allow-origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Credentials', true);
}

function sendMail(to, subject, text, callback) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tonghe378@gmail.com',
            pass: 'wth19920121'
        }
    });
    var mailOptions = {
        from: '书签同步工具', // sender address
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
    var length = chars.length;
    var str = '';
    for (var i = 0; i < num; i++) {
        var s = chars[Math.ceil(Math.random() * length)];
        str += s;
    }
    return str;

}
module.exports = {
    result2json,
    error2json,
    sendMail,
    getRandom
}