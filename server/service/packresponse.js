function result2json(res, result) {
    res.setHeader('Access-Control-Allow-origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.json({ "result": result });
}
module.exports = {
    result2json: result2json
}