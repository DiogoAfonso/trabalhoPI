
var express = require('express');
var router = express.Router();
var enumerable = require('linq');

var dbU = require('./../db/Users');
var user = require('./../models/UserModel');
var dbC = require('./../db/Complains');

var isAuthenticatedMiddleWare = require('./../middleware/authenticated');

var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'pi.queixasnanet.g2@gmail.com',
    pass: '123qwerty456'
  }
});

router.get('/login', function(req, res, next) {
  res.render('UsersView/login', { Title: "Queixas Na Net", user: undefined });
});

router.post('/login', function(req, res, next) {
  var pass = req.body.password;
  var userName = req.body.user;

  dbU.Model.getOneUserWithPass([userName, pass.toString()], function(err, user){
    console.log(user === null);
    if (err) {
      if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: undefined, msg: "Utilizador inexistente!" } );//return next (new Error(err));
    }
    if (user === null) {
      return res.render('SiteViews/error', {Title: "Queixas Na Net", user: undefined, msg: "Utilizador inexistente!" } );//return next (new Error(err));
    }
    if((user.password === pass)) {
      user.logged = true;
      res.setCurrentUser(userName);
    }
    res.redirect('/');
  });
}); //fazer um middleware aqui se true, mudar o type no user na bd

router.get('/logout', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
  res.render('UsersView/logout', { Title: "Queixas Na Net", user: req.models.user });
});

router.post('/logout', function(req, res, next) {
  res.deleteCurrentUser();
  res.redirect('/');
}); //fazer um middleware aqui se true, mudar o type no user na bd

router.post('/register', function(req, res, next) {
  var nick = req.body.nickname;
  var params = [nick, req.body.username, req.body.email, req.body.pass];
    dbU.Model.registerUser(params, function(err) {
    if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: undefined, msg: "Utilizador existente!" } );//return next (new Error(err));
    res.setCurrentUser(nick);
    res.redirect('/');
  });
});
router.get('/register', function(req, res, next) {
  res.render('UsersView/register', { Title: "Queixas Na Net", user: undefined });
});

router.post('/forgotPassword', function(req, res, next){
  var nickname = req.body.nickname;
  dbU.Model.retrievePassword(nickname, function(err, user) {
    if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: nickname, msg: "Utilizador inexistente!" } );//return next (new Error(err));
    if (user !== null) {
      smtpTransport.sendMail({
        from:  'QueixinhasNaNet <pi.queixasnanet.g2@gmail.com>' ,
        to: user.email,
        subject: 'Recuperação palavra-passe',
        text: 'A sua palavra passe é: ' + user.password
      }, function(error, response) {
        if (error)
          return res.render('SiteViews/error', {Title: "Queixas Na Net", user: nickname, msg: "E-mail inválido!" } );//return next (new Error(error));
      });
    }
    res.redirect('/');
  });
});
router.get('/forgotPassword', function(req, res, next){
  res.render('UsersView/forgot', { Title: "Queixas Na Net" , user: undefined});
});


router.get('/:user', isAuthenticatedMiddleWare.authenticated, function(req, res, next) {
  var user = req.params.user;
  dbC.Model.findComplainsByUser(user, function(err, complains) {
    if (err) return res.render('SiteViews/error', {Title: "Queixas Na Net", user: user, msg: "Não existem queixas!"} );//return next (new Error(err));

    var complainsOrdered = enumerable.from(complains).orderBy(function(complain) { return complain.id }).toArray();
    res.render('QueixasView/allQueixas', { complains : complainsOrdered, Title: "Queixas Na Net", user: req.models.user, dash: "user" });
  });
});

module.exports = router;