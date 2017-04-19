var express = require('express');
var dao_users = require('../dao/users');
var utils = require('../utils');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/getVersion', function(req, res) {
    var userid = req.query.userid;
    dao_users.getVersion(userid, function(err, data) {
        if (err) {
            return utils.error2json(res, err);
        }
        console.log('getVersion:' + JSON.stringify(data));
        utils.result2json(res, data);
    });
});

router.post('/register', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var code = req.body.code;
    dao_users.getMailCode(email, function(err, data) {
        if (err) {
            return utils.error2json(res, err);
        }
        if (data.code == code) {
            var crypwd = utils.encryptSHA1(password);
            dao_users.register(email, crypwd, function(err, data) {
                if (err) {
                    return utils.error2json(res, err);
                }
                utils.result2json(res, data);
            });
        } else {
            utils.error2json(res, '验证码有误！');
        }
    });
});

router.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(req.signedCookies);
    dao_users.login(email, function(err, data) {
        if (err) {
            return utils.error2json(res, err);
        }
        if (data.password) {
            if (utils.encryptSHA1(password) == data.password) {
                utils.setUser2Cookie(res, email); //设置用户到cookie

            }
            // utils.result2json(res,)
        }
    });
});


module.exports = router;