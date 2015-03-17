
module.exports = { lastCommentID: lastCommentID };
var db = require('./../db/Complains');

function lastCommentID (req, res, next) {
    db.Model.getCommentLastID(req.params.id, function(err, comments) {
        if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user , msg: "Não existe queixa!" } );//return next (new Error(err));

        req.models = req.models || {};
        if(comments.length === 0) {
            req.models.commentID = 1;
        } else {
            req.models.commentID = comments[0].comentario+1;
        }

        next();
    });
}
