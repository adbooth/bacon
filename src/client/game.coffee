game = new Phaser.Game 800, 600, Phaser.AUTO, '', {
  preload: preload
  create: create
  update: update
}

preload = ->
  game.load.image 'blue-circle', '/public/assets/circle-32.ico'
  game.load.image 'red-circle', 'public/assets/circle-32.gif'

create = ->
  game.physics.startSystem Phaser.Physics.ARCADE

  cursors = game.input.keyboard.createCursorKeys()

  protagonist = game.add.sprite initial_player_data.x, initial_player_data.y, 'blue-circle'
  protagonist.name = client_username
  game.physics.arcade.enable protagonist
  protagonist.body.collideWorldBounds = true

update = ->
  protagonist.body.velocity.x = protagonist.body.velocity.y = 0
  if cursors.up.isDown
    protagonist.body.velocity.y -= 150
  if cursors.down.isDown
    protagonist.body.velocity.y += 150
  if cursors.left.isDown
    protagonist.body.velocity.x += 150
  if cursors.right.isDown
    protagonist.body.velocity.x -= 150
