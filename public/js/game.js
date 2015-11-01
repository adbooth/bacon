var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.load.image('blue-circle', '/assets/circle-32.ico');
    game.load.image('red-circle', '/assets/circle-32.gif');
}

var protagonist;
var playergroup;
var players;
var cursors;

function create() {
    // Some sort of necessary physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // I/O creation
    cursors = game.input.keyboard.createCursorKeys();

    protagonist = game.add.sprite(100, 100, 'blue-circle');
    game.physics.enable(protagonist);
    protagonist.body.collideWorldBounds = true;

    // Protagonist creation
    // protagonist = game.add.sprite(initial_player_data.x, initial_player_data.y, 'blue-circle');
    // protagonist.name = client_username;
    // game.physics.arcade.enable(protagonist);
    // protagonist.body.collideWorldBounds = true;

    // Other player data
    // players = {};
    // playergroup = game.add.group();
    // playergroup.enableBody = true;
    // var playerdict = initial_game_data.playerdict;
    // for(var username in playerdict){
    //     if(username == client_username){
    //         continue;
    //     }
    //     if(playerdict.hasOwnProperty(username)){
    //         var player = playergroup.create(playerdict[username].x, playerdict[username].y, 'red-circle');
    //         player.name = username;
    //         players[username] = player;
    //     }
    // }
}

function update() {
    // game.physics.arcade.collide(protagonist, playergroup);

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

    // socket.emit('LOCATION_UPDATE', {
    //     'username': client_username,
    //     'x': protagonist.x,
    //     'y': protagonist.y
    // });
    //
    // for(var player in players){
    //     console.log(player);
    // //     console.log('x: ' + player.x + '     y: ' + player.y);
    // }
}

// dispatch = {
//     'HANDSHAKE_TO_CLIENT': function(payload){
//         if(payload == 'shake'){
//             console.log('Connection confirmed.');
//         }
//     },
//     'PLAYER_ADDED': function(payload){
//         player = playergroup.create(payload.x, payload.y, 'red-circle');
//         player.name = payload.username;
//         players[payload.username] = player;
//         console.log(payload.username + ' has joined the game.');
//     },
//     'PLAYER_REMOVED': function(payload){
//         player = players[payload];
//         playergroup.remove(player);
//         var index = $.inArray(player, players);
//         if(index > -1){
//             players = players.splice(index, 1);
//         }
//         console.log(payload + ' has left the game.');
//     },
//     'GAME_UPDATE': function(payload){
//         var playerdict = payload.playerdict;
//         for(var username in players){
//             players[username].x = playerdict[username].x;
//             players[username].y = playerdict[username].y;
//         }
//     }
// };
//
// var broadcastCommands = [
//     'PLAYER_ADDED',
//     'PLAYER_REMOVED',
// ];
//
// socket.on('SERVER_MESSAGE', function(message){
//     command = message.command;
//     if($.inArray(command, broadcastCommands) < 0 && message.username != client_username){
//         return;
//     }
//     dispatch[command](message.payload);
// });
//
// $(window).unload(function(){
//     socket.emit('GAME_CLOSE', {'username': username});
// });
