
module.exports = function(app) {
    var db = require('./../db/Complains');

    var commentsMiddleWare = require('./../middleware/allComments');
    var commentIDMiddleWare = require('./../middleware/lastComment');
    var complainVoteMiddleWare = require('./../middleware/voteComplain');
    var followVoteMiddleWare = require('./../middleware/followComplain');
    var isAuthenticatedMiddleWare = require('./../middleware/authenticated');
    var viewComplainMiddleWare = require('./../middleware/viewComplain');
    var locationComplainMiddleWare = require('./../middleware/allLocations');

    var express = require('express');
    var enumerable = require('linq');

    var queixaRouter = express.Router();

    queixaRouter.get('/complains', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
        var limit = "";
        if (req.models.user === undefined) {
            limit = " LIMIT 2"; //TODO modificar no final
        }
        db.Model.findAllComplain(limit, function(err, complains) {
            if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Não existem queixas!"} );//return next (new Error(err));

            var complainsOrdered = enumerable.from(complains).orderBy(function(complain) { return complain.id }).toArray();

            var mod = {complains : complainsOrdered, Title: "Queixas Na Net", user: req.models.user, dash: "geral" };
            res.render('QueixasView/allQueixas', mod);
        });
    });

    queixaRouter.get('/create', isAuthenticatedMiddleWare.authenticated, locationComplainMiddleWare.allLocations, function(req, res, next) {
        db.Model.findAllCategorys(function(err, categorys) {
            if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "A queixa já existe!" } );//return next (new Error(err));

            var arr = categorys;
            var locations = req.models.locations;
            res.render('QueixasView/create', {Title: "Queixas Na Net", categorys: arr, user: req.models.user, locations: locations });
        });
    });

    queixaRouter.get('/category/:cat', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
        var cat = req.params.cat;
        db.Model.findComplainsByCategory(cat, function(err, categorys) {
            if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "A queixa já existe!" } );//return next (new Error(err));

            var complainsOrdered = enumerable.from(categorys).orderBy(function(category) { return category.id }).toArray();
            var mod = {complains : complainsOrdered, Title: "Queixas Na Net", user: req.models.user, dash: "geral" };
            res.render('QueixasView/allQueixas', mod);
        });
    });

    queixaRouter.get('/location/:loc', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
        var loc = req.params.loc;
        db.Model.findComplainsByLocal(loc, function(err, locations) {
            if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "A queixa já existe!" } );//return next (new Error(err));

            var complainsOrdered = enumerable.from(locations).orderBy(function(complain) { return complain.id }).toArray();
            var mod = {complains : complainsOrdered, Title: "Queixas Na Net", user: req.models.user, dash: "geral" };
            res.render('QueixasView/allQueixas', mod);
        });
    });

    queixaRouter.post('/create', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
        var params = [req.body.complainTitle, req.models.user, req.body.complainDescr, req.body.categoryTitle, req.body.locationComplain];
        db.Model.postComplain(params, function(err, idComplain) {
            if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "A queixa já existe!" } );//return next (new Error(err));

            var obj = idComplain.rows;
            res.redirect('/queixasNaNet/complains#'+obj[0].id+"-complain");
        });
    });

    queixaRouter.post('/:id/comment', isAuthenticatedMiddleWare.authenticated, commentIDMiddleWare.lastCommentID, function(req, res, next) {
        var id = req.params.id;
        var params = [req.models.user, id, req.body.commentText];
        db.Model.postComment(params, function(err, comment) {
            if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Comentário com erros!" } );//return next (new Error(err));

            res.redirect('/queixasNaNet/'+id+'#'+req.models.commentID+'-comment');
        });
    });

    queixaRouter.post('/:id/up', isAuthenticatedMiddleWare.authenticated, complainVoteMiddleWare.voteComplain, function(req, res, next) {
        var id = req.params.id;

        if (req.models.voted !== true) {
            db.Model.increaseLikes(id, function(err) {
                if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Votação errada!" } );//return next (new Error(err));
            });
        }
        return res.redirect('/queixasNaNet/'+id);
    });

    queixaRouter.post('/:id/down', isAuthenticatedMiddleWare.authenticated, complainVoteMiddleWare.voteComplain, function(req, res, next) {
        var id = req.params.id;

        if (req.models.voted !== true) {
            db.Model.decreaseLikes(id, function(err) {
                if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Votação errada!" } );//return next (new Error(err));
            });
        }
        return res.redirect('/queixasNaNet/'+id);
    });

    queixaRouter.post('/:id/follow', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
        var id = req.params.id;
        db.Model.followComplain([id, req.models.user], function(err) {
            if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Incapaz de seguir a queixa!" } );//return next (new Error(err));

            return res.redirect('/queixasNaNet/'+id);
        });
    });

    queixaRouter.get('/:id', isAuthenticatedMiddleWare.authenticated, commentsMiddleWare.allComments,
        complainVoteMiddleWare.getVoteComplain, followVoteMiddleWare.followComplain,
        viewComplainMiddleWare.viewComplain, function(req, res, next) {
            db.Model.getOneComplain(req.params.id, function(err, complain) {
                if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Queixa inexistente!" } );//return next (new Error(err));

                var commentsComplain = new Array();
                if (req.models.comments.length === 0)
                    commentsComplain = undefined;
                else {
                    var arr = req.models.comments;
                    for (var i = 0; i < arr.length; ++i) {
                        var obj = arr[i];
                        commentsComplain.push({ text: obj["text"], userC: obj["extUsr"], idC: obj["comentario"], dateComment: obj["dateComment"]});
                    }
                }
                var voted = req.models.voted;
                var follow = req.models.follow;
                var isFollowing = false;
                if (follow === req.models.user) {
                    isFollowing = true;
                }

                var mod = { complain : complain, Title: "Queixas Na Net", comments : commentsComplain, voted : voted, follow: isFollowing, user: req.models.user};
                res.render('QueixasView/singleQueixa', mod);
            });
        });

    app.use('/queixasNaNet', queixaRouter);
}
