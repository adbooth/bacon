### Game.coffee ###
# Module imports
Player = require './Player'


class Game
  constructor: ->
    @players = {}
    @gameSize = 2000

  addPlayer: (fingerprint, remote, username, x, y) ->
    @players[fingerprint] = new Player(this, fingerprint, remote, username, x, y)

  removePlayer: (fingerprint) ->
    delete @players[fingerprint]

  usernameExists: (username) ->
    username in [player.username for player in @players]

  generateXY: ->
    loop
      randx = @gameSize*(2*Math.random() - 1)
      continue if randx/10 in [player.x/10 for player in @players]
      randy = @gameSize*(2*Math.random() - 1)
      break unless randy/10 in [player.y/10 for player in @players]
    [randx, randy]


module.exports = new Game
