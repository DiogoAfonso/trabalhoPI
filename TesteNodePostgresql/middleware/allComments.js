
module.exports = { allComments: allComments };
var db = require('./../db/Complains');

function allComments (req, res, next) {
    db.Model.getOneComplainInfo(req.params.id, function(err, comments) {
        if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Queixa sem comentários!" } );//return next (new Error(err));

        req.models = req.models || {};
        req.models.comments = comments;
        next();
    });
}
