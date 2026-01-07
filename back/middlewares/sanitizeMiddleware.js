const xss = require('xss');

module.exports = (req, res, next) => {
    if (req.body) {
        req.body = JSON.parse(xss(JSON.stringify(req.body)));
    }
    next();
};