
module.exports = { voteComplain: voteComplain, getVoteComplain: getVoteComplain };
var db = require('./../db/Complains');
var CompModel = require('./../models/ComplainModel');

function voteComplain (req, res, next) {
    var params = [req.models.user, req.params.id, req.body.voteType];
    db.Model.complainVote(params, function(err) {
        req.models = req.models || {};
        if (err) {
            req.models.voted = true;
        }

        next();
    });
}

function getVoteComplain (req, res, next) {
    var params = [req.models.user, req.params.id];
    db.Model.getComplainVote(params, function(err, voted) {
        if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user , msg: "Incapaz de votar na queixa" } );//return next (new Error(err));

        req.models = req.models || {};
        if (voted.length === 0) {
            req.models.voted = new CompModel.VoteComplain(undefined);
        } else {
            req.models.voted = voted[0];
        }

        next();
    });
}