var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: eurecaClientSetup,
    update: update
});

var ready = false;
var eurecaServer;
var protagonist;

function eurecaClientSetup(){
    var eurecaClient = new Eureca.Client();

    eurecaClient.ready(function(proxy){
        eurecaServer = proxy;
        ready = true;
        create();
    });

    eurecaClient.exports.setId = function(id){
        myId = id;
        eurecaServer.handshake();
    };

    eurecaClient.exports.kill = function(id){

    };

    eurecaClient.exports.echoPrint = function(data){
        console.log("Echoed string: ", data);
    };
}

function preload(){
    game.load.image('blue-circle', '/assets/circle-32.ico');
    game.load.image('red-circle', '/assets/circle-32.gif');
}

function create(){
    game.physics.startSystem(Phaser.Physics.ARCADE);

    protagonist = game.add.sprite(50, 50, 'blue-circle');
    game.physics.arcade.enable(protagonist);
    protagonist.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
}

function update(){
    if(!ready) return;

    // Moves protagonist based on input
    protagonist.body.velocity.x = 0;
    protagonist.body.velocity.y = 0;
    if(cursors.left.isDown){
        protagonist.body.velocity.x -= 150;
    }
    if(cursors.right.isDown){
        protagonist.body.velocity.x += 150;
    }
    if(cursors.up.isDown){
        protagonist.body.velocity.y -= 150;
    }
    if(cursors.down.isDown){
        protagonist.body.velocity.y += 150;
    }
}
