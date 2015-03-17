
module.exports = { authenticated: authenticated };


var cookieName = require('./authentication').cookieName;

function authenticated (req, res, next) {
    var user = req.cookies[cookieName] || undefined;
    req.models = req.models || {};
    req.models.user = user;

    next();
};

