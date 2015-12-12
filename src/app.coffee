# Node imports
path = require 'path'
# 3rd party imports
express = require 'express'


# Start new game
game = exports.game = require './models/Game'

# Make Express.js app
app = exports.app = express()
Eureca = require 'eureca.io'
eurecaServer = exports.Eureca = new Eureca.Server {
  allow: ['setFingerprint', 'clientDisconnect', 'spawnEnemy', 'updateState']
}
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


# Start server
app.set 'port', process.env.PORT or 5000
server = app.listen app.get('port'), ->
  host = server.address().address
  port = app.get 'port'
  console.log "Application server running at http://#{host}:#{port}"


# Eureca server start and event handlers
eurecaServer.attach server

# On client connect, add client to client list and send connection ID to client
eurecaServer.onConnect (conn) ->
  console.log "New client connected with id: #{conn.id}", conn.remoteAddress
  remote = eurecaServer.getClient conn.id
  # Send fingerprint to client
  username = remote.setFingerprint conn.id
  console.log "Received username is ", username
  # Add client to client list
  # TODO acccess db here for initialization info
  game.addPlayer conn.id, remote, username


# On client disconnect, remove client from client list and broadcast disconnect
eurecaServer.onDisconnect (conn) ->
  console.log "Client disconnected with id: #{conn.id}"
  # Remove client from client list
  game.removePlayer conn.id

  # Signal disconnect to other clients
  for fingerprint, player of game.players
    player.remote.clientDisconnect conn.id

### Here's where we'll export some server functions the client can call ###
###
 * Called in client setup function
 * Gets client up to speed
 ###
eurecaServer.exports.handshake = ->
  console.log "In handshake,", game.players
  requesterFingerprint = this.connection.id
  requester = game.players[requesterFingerprint]
  for fingerprint, player of game.players
    # Alert existing players of join
    player.remote.spawnEnemy requesterFingerprint, requester.x, requester.y
    # Fill requester in on other players
    laststate = player.laststate
    [x, y] = if laststate then [laststate.x, laststate.y] else [0, 0]
    requester.remote.spawnEnemy fingerprint, x, y

### handleKeys
 * Called in `Player`'s `update()` function
 * Updates state of all players' simulations after another player input/update
 ###
eurecaServer.exports.handleKeys = (keys) ->
  conn = this.connection
  updatedClient = game.players[conn.id]

  for fingerprint, player of game.players
    player.remote.updateState updatedClient.fingerprint, keys
    player.laststate = keys
