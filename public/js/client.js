/* client.js */

// Server globals
var myFingerprint;
var eurecaServer;
var ready = false;

var eurecaClientSetup = function(){
    // Create instance of Eureca client
    var eurecaClient = new Eureca.Client();
    // Get reference to server through `eurecaServer` object
    eurecaClient.ready(function(proxy){
        eurecaServer = proxy;
    });


    /* Exported methods for use on server */

    /** setId
     * Called once by server in server event handler `onConnect`
     * `fingerprint` is created by Eureca library somehow and used as a connection ID
     */
    eurecaClient.exports.setFingerprint = function(fingerprint){
        // Local var `id` will now hold clients ID
        myFingerprint = fingerprint;
        console.log("Fingerprint set to: ", myFingerprint);
        // `create()` moved here so that Phaser environment is not created until fingerprint is assigned
        create();
        // Here the client makes contact with the server to initialize some stuff?
        eurecaServer.handshake();
        // Guard in the update loop to keep from updating occuring until fingerprint is assigned
        ready = true;
    };

    /** clientDisconnect
     * Called by server in server event handler `onDisconnect`
     * Called on each client since the server has to inform them of a player leaving
     */
    eurecaClient.exports.clientDisconnect = function(peerFingerprint){
        if(playerList[peerFingerprint]){
            console.log("Killing %s", playerList[peerFingerprint]);
            playerList[peerFingerprint].kill();
        }
    };

    /** spawnEnemy
     * Called by server in server method `handshake`
     * Called on each client to spawn the newly joined player
     */
    eurecaClient.exports.spawnEnemy = function(peerFingerprint, x, y){
        // Guard against spawning client's self
        if(myFingerprint == peerFingerprint) return;
        // Add new player to player list
        // TODO figure out why the hell the tutorial has nested for-loops
        playerList[peerFingerprint] = new Pig(peerFingerprint, game);
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
            player.update();
        }
    };
};
