### eurecaServer.coffee ###
# 3rd party imports
Eureca = require 'eureca.io'
# Module imports
game = require('./app').game

eurecaServer = new Eureca.Server {
  allow: ['handshakeToClient', 'peerDisconnect', 'addPeer', 'updateState']
}

# Eureca server start and event handlers
eurecaServer.attach require('./app').server

###* onConnect
 * On client connect, start the handshake
 * This sends the client some initialization data
 ###
eurecaServer.onConnect (conn) ->
  console.log "Client connected, id: #{conn.id}"
  [x, y] = game.generateXY()
  eurecaServer.getClient(conn.id).handshakeToClient {
    fingerprint: conn.id
    gameSize: game.gameSize
    x: x
    y: y
  }

###* handshakeToServer
 * Called in client setup function
 * Gets client up to speed
 ###
eurecaServer.exports.handshakeToServer = (payload) ->
  requesterFingerprint = this.connection.id
  remote = eurecaServer.getClient requesterFingerprint

  # Add client to game
  requester = game.addPlayer(
    requesterFingerprint, remote, payload.username, payload.x, payload.y)

  # Loop through players to update everyone
  for fingerprint, player of game.players
    unless fingerprint == requesterFingerprint
      # Alert existing players of join
      player.remote.addPeer(
        requesterFingerprint, requester.username, requester.x, requester.y)

      # Fill requester in on other players
      laststate = player.laststate
      [x, y] = if laststate then [laststate.x, laststate.y] else [0, 0]
      requester.remote.addPeer fingerprint, player.username, x, y
      console.log player.username

###* handleKeys
 * Called in `Player`'s `update()` function
 * Updates state of all players' simulations after another player input/update
 ###
eurecaServer.exports.handleKeys = (keys) ->
  updatedClient = game.players[this.connection.id]

  for fingerprint, player of game.players
    player.remote.updateState updatedClient.fingerprint, keys
    player.laststate = keys

###* onDisconnect
 * On client disconnect, remove client from client list and broadcast disconnect
 ###
eurecaServer.onDisconnect (conn) ->
  console.log "Client disconnected, id: #{conn.id}"
  # Remove client from client list
  game.removePlayer conn.id

  # Signal disconnect to other clients
  for fingerprint, player of game.players
    player.remote.peerDisconnect conn.id
