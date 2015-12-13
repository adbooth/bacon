### eurecaServer.coffee ###
# 3rd party imports
Eureca = require 'eureca.io'
# Module imports
game = require('./app').game

eurecaServer = new Eureca.Server {
  allow: ['handshakeToClient', 'peerDisconnect', 'spawnPeer', 'updateState']
}

# Eureca server start and event handlers
eurecaServer.attach require('./app').server

# On client connect, start the handshake
eurecaServer.onConnect (conn) ->
  console.log "Client connected, id: #{conn.id}"
  eurecaServer.getClient(conn.id).handshakeToClient(conn.id)

# On client disconnect, remove client from client list and broadcast disconnect
eurecaServer.onDisconnect (conn) ->
  console.log "Client disconnected, id: #{conn.id}"
  # Remove client from client list
  game.removePlayer conn.id

  # Signal disconnect to other clients
  for fingerprint, player of game.players
    player.remote.peerDisconnect conn.id

### Here's where we'll export some server functions the client can call ###
###
 * Called in client setup function
 * Gets client up to speed
 ###
eurecaServer.exports.handshakeToServer = (username) ->
  # Add client to client list
  # TODO acccess db here for initialization info
  game.addPlayer this.connection.id, eurecaServer.getClient(this.connection.id), username
  console.log "In to server handshake,", game.players
  requesterFingerprint = this.connection.id
  requester = game.players[requesterFingerprint]
  for fingerprint, player of game.players
    # Alert existing players of join
    player.remote.spawnPeer requesterFingerprint, requester.x, requester.y
    # Fill requester in on other players
    laststate = player.laststate
    [x, y] = if laststate then [laststate.x, laststate.y] else [0, 0]
    requester.remote.spawnPeer fingerprint, x, y

### handleKeys
 * Called in `Player`'s `update()` function
 * Updates state of all players' simulations after another player input/update
 ###
eurecaServer.exports.handleKeys = (keys) ->
  updatedClient = game.players[this.connection.id]

  for fingerprint, player of game.players
    player.remote.updateState updatedClient.fingerprint, keys
    player.laststate = keys
