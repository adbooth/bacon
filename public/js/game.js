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
var wasd;
var mouseSprite;

// Create game object
var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, 'phaser-example', {
    preload: preload,
    create: eurecaClientSetup,
    update: update
});

// Loads assets
function preload(){
    $('canvas').css('cursor', 'none');

    game.load.image('bacon', '/assets/bacon.png');
    game.load.image('background', '/assets/dirt.png');
    game.load.image('bullet', '/assets/bullet.png');
    game.load.image('crosshair', '/assets/crosshair.png');

    game.load.spritesheet('pig', '/assets/pigsheet.png', 25, 30, 16);
}

// Builds/initializes game world
function create(gameSize, playerX, playerY){
    // Must make size of game world
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

    // Mouse setup
    mouseSprite = game.add.sprite(game.input.mousePointer.worldX, game.input.mousePointer.worldY, 'crosshair');
    mouseSprite.anchor.set(0.5, 0.5);

    // Camera setup
    game.camera.follow(sprite);
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    // Control setup
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
}

// Game loop
function update(){
    // Don't start game loop until client is ready
    if(!ready) return;

    // Give protagonist new input values
    protagonist.input.up = wasd.up.isDown;
    protagonist.input.down = wasd.down.isDown;
    protagonist.input.left = wasd.left.isDown;
    protagonist.input.right = wasd.right.isDown;
    protagonist.input.fire = game.input.activePointer.isDown;
    protagonist.input.tx = game.input.x + game.camera.x;
    protagonist.input.ty = game.input.y + game.camera.y;
    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;
    // Draw mouse
    mouseSprite.position.set(game.input.mousePointer.worldX, game.input.mousePointer.worldY);

    // Update all the players
    for(var key1 in playerList){ if(playerList.hasOwnProperty(key1)){
        // for(var key2 in playerList){ if(playerList.hasOwnProperty(key2)){
        //     if(key1 != key2){
        //         game.physics.arcade.overlap(playerList[key2].bullets, playerList[key1], playerList[key1].getHit(), null, this);
        //     }
        // }}
        if(playerList[key1]) playerList[key1].update();
    }}
}
