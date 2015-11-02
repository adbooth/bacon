""" Transpiled from 'src/app.coffee' to 'app.js'
"""
# Node imports
path = require 'path'
# 3rd party imports
express = require 'express'

# Make Express.js app
app = express()

# Set up Jade engine and static folder
app.use express.static path.join __dirname, 'public'
app.set 'view engine', 'jade'

# Set up sessions and cookies and stuff
app.use require('express-session') {
  secret: '1234567890QWERTY'
  resave: true
  saveUninitialized: true
}
app.use require('cookie-parser')()

# Set up bodyparser for handling forms
bodyparser = require 'body-parser'
app.use bodyparser.json()
app.use bodyparser.urlencoded {extended: true}

# Grab routers from controllers
app.use '/', require './controllers'

# Start server
server = app.listen 5000, ->
  host = 'localhost'
  port = server.address().port
  console.log "Application server running at http://#{host}:#{port}"

# Start new game
game = require './models/Game'

# Make app & game available to outside imports
exports.app = app
exports.game = game
