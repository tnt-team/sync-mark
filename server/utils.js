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
module.exports = {
    result2json: result2json,
    error2json: error2json
}