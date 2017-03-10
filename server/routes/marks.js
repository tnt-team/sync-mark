var express = require('express');
var service_marks = require('../service/marks');
var packres = require('../service/packresponse');
var router = express.Router();


router.get('/getAll', function(req, res) {
    var result = service_marks.getAllMarks(req.query.userid);
    packres.result2json(res, result);
});
module.exports = router;