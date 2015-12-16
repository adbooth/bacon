/* game.js */

$(window).resize(function(){
    window.resizeGame();
});

function resizeGame(){
    var height = $(window).height();
    var width = $(window).width();

    game.width = width;
    game.height = height;
    game.world.bounds.width = width;
    game.world.bounds.height = height;

    if(game.renderType === Phaser.WEBGL){
    	game.renderer.resize(width, height);
    }
}

// Game globals
var protagonist;
var playerList;
var land;
var cursors;
var bulletTimes = 0;
var bacon;
var scoreText;
var healthText;
var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, 'phaser-example', {
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: eurecaClientSetup,
    update: update
});

// Loads assets
function preload(){
    game.load.image('background', 'assets/grid.png');
    game.load.image('bullet', 'assets/bullets.png');
    game.load.image('pig', 'assets/pig.png');
    game.load.image('bacon', 'assets/bacon.png');s
}

// Builds/initializes game world
function create(gameSize, playerX, playerY){
    // Must make size of game world
    // game.world.setBounds(-gameSize/2, -gameSize/2, gameSize, gameSize);
    game.world.setBounds(-gameSize/2, -gameSize/2, gameSize, gameSize);
    // Not sure what this does
    game.stage.disableVisibilityChange = true;

    // Tiled background
    land = game.add.tileSprite(0, 0, $(window).width(), $(window).height(), 'background');
    land.fixedToCamera = true;

    // Protagonist setup
    protagonist = new Player(game, myFingerprint, myUsername, playerX, playerY);
    playerList = {};
    playerList[myFingerprint] = protagonist;
    sprite = protagonist.sprite;
    sprite.bringToTop();

    // Camera setup
    game.camera.follow(sprite);
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    scoreText = game.add.text(0, 0, 'Bacon Count: 0', { font: "40px Arial", fill: "#99231F"});
    scoreText.fixedToCamera = true;

    healthText = game.add.text(1250, 0, 'Health: 8', { font: "40px Arial", fill: "#99231F"});
    healthText.fixedToCamera = true;
    // Control setup
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    //adding private bacon
    bacon = game.add.group();
    bacon.enableBody = true;
    for (var i = 0; i < 10; i++){
        var piece = bacon.create(
          game.rnd.integerInRange(-1000, 1000),
          game.rnd.integerInRange(-1000, 1000),
          'bacon');
    }

}

// Game loop
function update(){
    // Don't start game loop until client is ready
    if(!ready) return;

    // Give protagonist new input values
    protagonist.input.up = cursors.up.isDown;
    protagonist.input.down = cursors.down.isDown;
    protagonist.input.left = cursors.left.isDown;
    protagonist.input.right = cursors.right.isDown;
    protagonist.input.fire = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    protagonist.input.tx = game.input.x + game.camera.x;
    protagonist.input.ty = game.input.y + game.camera.y;
    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    // Update all the players

            for (var i in playerList){
          		if (!playerList[i]) continue;
          		var curBullets = playerList[i].bullets;
          		var curPlayer = playerList[i].sprite;
        		  for (var j in playerList){
        			     if (!playerList[j]) continue;
        			        if (j!=i){
        				            var targetPlayer = playerList[j];
        				            game.physics.arcade.overlap(curBullets, targetPlayer.sprite, bulletHitPlayer, null, this);
        			        }
        			if (playerList[j].alive) {
                playerList[j].update();
              }
        		  }
            }
}
function bulletHitPlayer(player, bullet) {
    bullet.kill();
    player.health--;
    healthText.text = 'Health: ' + player.health;
    if(player.health <= 0) player.kill();


}
