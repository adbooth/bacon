### routes.coffee ###
# 3rd party imports
router = require('express').Router()
# Module imports
game = require('./app').game

# Index route
router.get '/', (req, res) ->
  res.redirect '/start'

# Start routes
router.get '/start', (req, res) ->
  res.render 'start'
router.post '/start', (req, res) ->
  target_username = req.body.username
  unless game.usernameExists target_username
    # Store username on cookie
    res.cookie 'username', target_username, { maxAge: 120000, httpOnly: false}
    res.redirect '/play'
  else
    res.render 'start'

# Play route
router.get '/play', (req, res) ->
  res.render 'play'


# Export the router that was just made
module.exports = router
