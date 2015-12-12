""" Transpiled from 'src/models/Game.coffee' to 'models/Game.js'
"""
# Module imports
Player = require './Player'


class Game
  constructor: -> @players = {}

  addPlayer: (fingerprint, remote, x=50, y=50) ->
    @players[fingerprint] = new Player(this, fingerprint, remote, x, y)

  removePlayer: (fingerprint) ->
    delete @players[fingerprint]

  # usernameExists: (username) ->
  #   return username in [player.username for player in @players]


module.exports = new Game
