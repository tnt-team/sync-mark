var express = require('express');
var dao = require('../dao/mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});



module.exports = router;