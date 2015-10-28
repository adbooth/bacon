# View controller
# express = require 'express'
# app = express()
app = require('app').app
app.use 'view engine', 'jade'

# Index endpoint redirects to start (for now)
app.get '/', (req, res) ->
  res.redirect '/start'

# Start endpoint validates form on POST
app.route '/start'
  .get (req, res) ->
    console.log 'get world'
  .post (req, res) ->
    console.log 'post world'

# Play endpoint presents the game to the user
app.route '/play'
  .get (req, res) ->
    res.render 'play'
