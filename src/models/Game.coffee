""" Transpiled from 'src/models/Game.coffee' to 'models/Game.js'
"""
# Module imports
Player = require './Player'


class Game
  constructor: -> @players = {}

  addPlayer: (id, remote, username, x=50, y=50) ->
    player = new Player(this, id, remote, username, x, y)
    @players[id] = player

  removePlayer: (id) ->
    delete @player[id]

  usernameExists: (username) ->
    return username in [player.username for player in @players]


module.exports = new Game
