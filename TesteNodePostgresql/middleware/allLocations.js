
module.exports = { allLocations: allLocations };
var db = require('./../db/Complains');

function allLocations (req, res, next) {
    db.Model.findAllLocations(function(err, locations) {
        if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Sem localização!" } );//return next (new Error(err));

        req.models = req.models || {};
        req.models.locations = locations;
        next();
    });
}
