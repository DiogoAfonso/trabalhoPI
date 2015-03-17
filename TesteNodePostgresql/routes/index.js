
var express = require('express');
var router = express.Router();

var fs = require('fs');

var db = require('./../db/Complains');
var isAuthenticatedMiddleWare = require('./../middleware/authenticated');

var arr = new Array();
function getImages() {
  var dirImg = fs.readdirSync('../public/images/home');
  for (var i = 0; i < dirImg.length-1; ++i) {
    arr.push("/images/home/"+dirImg[i]);
  }
  return arr;
}
var indexInformation = ['Home', 'Contact', 'About'];
var target = ['/', '/contact', '/about'];

router.get('/', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
  db.Model.getHomeComplains(function(err, models) {
    if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: req.models.user, msg: "Não existem queixas!" } );//return next (new Error(err));

    var all = models;
    var quotations = new Array();
    if (all !== undefined) {
      for (var i = 0; i < all.length; ++i) {
        quotations.push('<a href="/queixasNaNet/'+ all[i].id+'">'+ all[i].title+'</a>|');
      }
    }

    var mod = { target: target, inf: indexInformation, Title: 'Queixas Na Net', imgs : getImages(), quotes : quotations, offst : 12000, user: req.models.user};

    res.render('index', mod);
  });

});

router.get('/about', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
  res.render('SiteViews/about', {Title: 'Queixas Na Net', user: req.models.user });
});

router.get('/contact', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
  res.render('SiteViews/contact', {Title: 'Queixas Na Net' , user: req.models.user });
});

module.exports = router;