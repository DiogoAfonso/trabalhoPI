
var COOKIE_NAME = "::user_id::";

module.exports = function() {

    return function(req, res, next) {
        res.setCurrentUser = function(user) {
            res.cookie(COOKIE_NAME, user);
        }
        res.deleteCurrentUser = function() {
            res.cookie(COOKIE_NAME, "", {maxAge: -1});
        }
        next();
    }

};

module.exports.cookieName = COOKIE_NAME;