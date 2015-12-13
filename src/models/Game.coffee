### Game.coffee ###
# Module imports
Player = require './Player'


class Game
  constructor: ->
    @players = {}
    @currentPlayerIndex = 1

  addPlayer: (fingerprint, remote, username, x=0, y=0) ->
    @players[fingerprint] = new Player(this, fingerprint, remote, x=x, y=y)

  removePlayer: (fingerprint) ->
    delete @players[fingerprint]

  usernameExists: (username) ->
    return username in [player.username for player in @players]


module.exports = new Game
