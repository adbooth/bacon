""" Transpiled from 'src/models/Game.coffee' to 'models/Game.js'
"""
# Module imports
Player = require './Player'


class Game
  constructor: -> @players = {}

  addPlayer: (username, x=50, y=50) ->
    player = new Player(this, username, x, y)
    @players[username] = player

  removePlayer: (username) ->
    delete @player[username]


module.exports = new Game
