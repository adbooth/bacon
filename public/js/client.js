/* client.js */

// Server globals
var myFingerprint;
var myUsername;
var eurecaServer;
var ready = false;

/** eurecaClientSetup
 * Called when the Phaser game object is being initialized
 */
var eurecaClientSetup = function(){
    // Create instance of Eureca client
    var eurecaClient = new Eureca.Client();
    // Get reference to server through `eurecaServer` object
    eurecaClient.ready(function(proxy){
        eurecaServer = proxy;
    });

    /** handshakeToClient
     * Called once by server in server event handler `onConnect`
     * `fingerprint` is created by Eureca library somehow and used as a connection ID
     */
    eurecaClient.exports.handshakeToClient = function(payload){
        console.log("Handshake started");
        myFingerprint = payload.fingerprint;
        console.log("Fingerprint set to: ", myFingerprint);

        // Pull username out of cookie string
        var cookies = document.cookie.split(';');
        for(var index in cookies){
            if(cookies[index].indexOf('username=') > -1){
                myUsername = cookies[index].replace(' username=', '');
                break;
            }
        }
        // Send username back to client
        eurecaServer.handshakeToServer({
            username: myUsername,
            x: payload.x,
            y: payload.y
        });

        // Create game world and let game update loop
        create(payload.gameSize, payload.x, payload.y);
        ready = true;
    };

    /** addPeer
     * Called by server in server method `handshake`
     * Called on each client to spawn the newly joined player
     */
    eurecaClient.exports.addPeer = function(peerFingerprint, username, x, y){
        // Guard against spawning client's self
        if(myFingerprint == peerFingerprint) return;
        console.log(myFingerprint, "spawning player on", peerFingerprint);
        // Add new player to player list
        playerList[peerFingerprint] = new Player(game, peerFingerprint, username, x, y);
        console.log("Enemy spawned");
    };

    /** updateState
     * Called by server in server method `handleKeys`
     * Called on each client to update their simulation of a player
     */
    eurecaClient.exports.updateState = function(fingerprint, state){
        player = playerList[fingerprint];
        if(player){
            player.cursor = state;
            // Update location data
            player.sprite.x = state.x;
            player.sprite.y = state.y;
            // Update movement data
            player.sprite.body.angularVelocity = state.angularVelocity;
            player.sprite.angle = state.angle;
            player.sprite.rotation = state.rotation;
            player.sprite.currentSpeed = state.currentSpeed;
        }
    };

    /** peerDisconnect
     * Called by server in server event handler `onDisconnect`
     * Called on each client since the server has to inform them of a player leaving
     */
    eurecaClient.exports.peerDisconnect = function(peerFingerprint){
        if(playerList[peerFingerprint]){
            console.log("Killing %s", playerList[peerFingerprint]);
            playerList[peerFingerprint].kill();
        }
    };
};
