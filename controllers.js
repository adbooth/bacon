// Generated by CoffeeScript 1.10.0
(function() {
  " Transpiled from 'src/controllers.coffee' to 'controllers.js'";
  var router;

  router = require('express').Router();

  router.get('/', function(req, res) {
    return res.redirect('/start');
  });

  router.get('/start', function(req, res) {
    return res.render('start');
  });

  router.post('/start', function(req, res) {
    var target_username;
    target_username = req.body.username;
    if (target_username) {
      req.session.username = target_username;
      return res.redirect('/play');
    } else {
      return res.render('start');
    }
  });

  router.get('/play', function(req, res) {
    return res.render('play');
  });

  router.post('/play', function(req, res) {
    return res.send({
      player_data: {
        username: req.session.username,
        x: 300,
        y: 300
      },
      game_data: {}
    });
  });

  module.exports = router;

}).call(this);
