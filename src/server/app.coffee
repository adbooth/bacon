# Make Express.js app
express = require 'express'
app = express()

# Set up Jade engine and static folder
app.set 'view engine', 'jade'
app.use express.static 'public'

# Set up sessions and cookies and stuff
app.use require('express-session') {
  secret: '1234567890QWERTY'
  resave: true
  saveUninitialized: true
}
# app.use require 'cookie-parser'

# Set up bodyparser for handling forms
bodyparser = require 'body-parser'
app.use bodyparser.json()
app.use bodyparser.urlencoded {extended: true}

# Index route, redirects to start (for now)
app.get '/', (req, res) ->
  res.redirect '/start'

# Start route, checks user submitted form
app.route '/start'
  .get (req, res) ->
    res.render 'start'
  .post (req, res) ->
    target_username = req.body.username
    if target_username
      req.session.username = target_username
      res.redirect 'play'
    else
      res.render 'start'

# Game route, responds with intitial game data on POST
app.route '/play'
  .get (req, res) ->
    res.render 'play'
  .post (req, res) ->
    res.contentType 'json'
    res.send {
      player_data: {
        username: req.session.username
        x: 200
        y: 250
      }
      game_data: {}
    }

# Start server
server = app.listen 5000, ->
  host = 'localhost'
  port = server.address().port
  console.log "Application server running at http://#{host}:#{port}"

# Make app available to outside imports
module.export = app
