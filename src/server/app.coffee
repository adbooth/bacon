# Make Express.js app
express = require 'express'
app = express()
path = require 'path'

# Set up Jade engine and static folder
app.use express.static path.join __dirname, 'public'
app.set 'view engine', 'jade'

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

# Grab routers from controllers
app.use '/', require './controllers'

# Start server
server = app.listen 5000, ->
  host = 'localhost'
  port = server.address().port
  console.log "Application server running at http://#{host}:#{port}"

# Make app available to outside imports
module.export = app
