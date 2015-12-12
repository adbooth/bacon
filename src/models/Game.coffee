""" Transpiled from 'src/models/Game.coffee' to 'models/Game.js'
"""
# Module imports
Player = require './Player'


class Game
  constructor: -> @players = {}

  addPlayer: (fingerprint, remote, username, x=0, y=0) ->
    @players[fingerprint] = new Player(this, fingerprint, remote, username, x, y)

  removePlayer: (fingerprint) ->
    delete @players[fingerprint]

  usernameExists: (username) ->
    return username in [player.username for player in @players]


module.exports = new Game
