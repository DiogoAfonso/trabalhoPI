
module.exports = { viewComplain: viewComplain };
var db = require('./../db/Complains');

function viewComplain (req, res, next) {
    if (req.models.user !== undefined) {
        var params = [req.models.user, req.params.id];
        db.Model.viewComplain(params, function(err) {
            if (err) { console.log("já viste esta!"); }
        });
    }
    next();
}