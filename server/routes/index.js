var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '书签同步 - 首页' });
});


router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/register', function(req, res, next) {
    res.render('register');

})



module.exports = router;