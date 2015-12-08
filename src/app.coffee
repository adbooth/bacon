""" Transpiled from 'src/app.coffee' to 'app.js'
"""
# Node imports
path = require 'path'
# 3rd party imports
express = require 'express'

# Make Express.js app
app = exports.app = express()
Eureca = require 'eureca.io'
Eureca = exports.Eureca = new Eureca.Server {allow: ['setId', 'kill', 'spawn']}
# Set up public folder and Jade view engine
app.use express.static path.join __dirname, 'public'
app.set 'view engine', 'jade'
# Set up session and cookies
# TODO Use a more secure secret key for the session setup
app.use require('express-session') {
  secret: '1234567890QWERTY'
  resave: true
  saveUninitialized: true
}
app.use require('cookie-parser')()
# Set up bodyparser for handling forms
# TODO Use CSRF for secure form posting
bodyparser = require 'body-parser'
app.use bodyparser.json()
app.use bodyparser.urlencoded {extended: true}
# Set up routes
app.use '/', require './routes'


# Start new game
game = exports.game = require './models/Game'


# Start server
app.set 'port', process.env.PORT or 5000
server = app.listen app.get('port'), ->
  host = server.address().address
  port = app.get 'port'
  console.log "Application server running at http://#{host}:#{port}"


# Eureca server start and event handlers
Eureca.attach server

# On client connect, add client to client list and send connection ID to client
Eureca.onConnect (conn) ->
  console.log "New client connected with id: #{conn.id}", conn.remoteAddress
  remote = Eureca.getClient conn.id
  # Add client to client list
  # TODO acccess db here for initialization info
  # TODO get username from POST
  game.addplayer conn.id, remote, username

  # Send ID to client
  remote.setId conn.id

# On client disconnect, remove client from client list and signal disconnect to
# other clients
Eureca.onDisconnect (conn) ->
  console.log "Client disconnected with id: #{conn.id}", conn.remoteAddress
  # Remove client from client list
  delete clients[conn.id]

  # Signal disconnect to other clients
  for client in clients
    client.remote.kill conn.id

### Here's where we'll export some functions the client can call on the server
###
# So this is where we have to get the client up to speed I'm guessing
Eureca.exports.handshake = ->
  for client in clients
    client.spawn client.id, client.x, client.y
