### Player.coffee ###

class Player
  constructor: (@game, @fingerprint, @remote, @username="Player#{@game.currentPlayerIndex++}", @x=0, @y=0) ->


module.exports = Player
