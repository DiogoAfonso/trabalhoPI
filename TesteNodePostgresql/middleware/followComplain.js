
module.exports = { followComplain: followComplain };
var db = require('./../db/Complains');

function followComplain (req, res, next) {
    var params = [req.models.user, req.params.id];
    db.Model.getFollowComplain(params, function(err, follow) {
        if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Incapaz de seguir a queixa!" } );//return next (new Error(err));

        req.models = req.models || {};
        if(follow.length === 0) {
            req.models.follow = undefined;
        }else {
            req.models.follow = follow[0].user.trim();
        }
        next();
    });
}
