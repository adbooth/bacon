/* application/static/js/socket.js */
// Do synchronous AJAX call to ask for username
var client_username, initial_player_data, initial_game_data;
$.ajax({
    type: 'POST',
    async: false,
    success: function(response){
        client_username = response.player_data.username;
        initial_player_data = response.player_data;
        initial_game_data = response.game_data;
    }
});

console.log('INIITAL PLAYER DATA');
console.log(initial_player_data);
console.log('INITIAL GAME DATA:');
console.log(initial_game_data);

// Create socket after we have the username to sign our communications with
// var thisURL = location.protocol + '//' + document.domain + (location.port ? ':' + location.port : '');
// socket = io.connect(thisURL);
//
// // On connect, start handshake
// socket.on('connect', function(){
//     socket.emit('HANDSHAKE_FROM_CLIENT', {
//         'username': client_username,
//         'payload': 'hand'
//     });
// });
