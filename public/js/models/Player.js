/* Player.js */

/** Player
 * Class represents a player object for the game, with reference to a Phaser sprite object
 */
Player = function(game, fingerprint, username, x, y){
    this.game = game;
    this.username = username;
    console.log("Creating", fingerprint, "'s sprite'");
    this.sprite = this.game.add.sprite(x, y, 'pig');
    this.fingerprint = this.sprite.id = fingerprint;
    this.alive = true;
    this.currentSpeed = 0;
    this.baconCount = 0;
    this.sprite.health = 8;

    // Username setup
    this.usernameLabel = this.game.add.text(0, -30, '<' + this.username + '>', {
        font: "15px Arial",
        fill: "#00CC66"
    });
    this.usernameLabel.anchor.set(0.5, 0.5);
    this.sprite.addChild(this.usernameLabel);


    // Sprite initial values
    this.sprite.angle = 0;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.name = this.username;
    // Sprite physics
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.body.maxVelocity.set(400);
    this.sprite.body.drag.set(200);     // TODO look up this sprite field
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(0, 0);        // TODO look up this sprite field
    game.physics.arcade.velocityFromRotation(this.sprite.rotation, 0, this.sprite.body.velocity);

    // Bullet business
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(20, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.fireRate = 500;
    this.nextFire = 0;
    this.canFire = true;
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    // Control fields
    this.cursor = {
        left: false,
        right: false,
        up: false,
        down: false,
        fire: false
    };
    this.input = {
        left: false,
        right: false,
        up: false,
        down: false,
        fire: false
    };
};

/** update
 * Called in Phaser's `update()` loop
 * Updates player's game state on server as well as in game from server input
 */
Player.prototype.update = function(){
    // We shouldn't have to worry about dead players
    if(!this.alive) return;

    // Detect a change input between client and server states
    var inputChanged = (
        this.cursor.left != this.input.left ||
        this.cursor.right != this.input.right ||
        this.cursor.up != this.input.up ||
        this.cursor.down != this.input.down ||
        this.cursor.fire != this.input.fire
    );

    // Send new values to the server for this player based on input
    if(inputChanged && this.fingerprint == myFingerprint){
        // Location data
        this.input.x = this.sprite.x;
        this.input.y = this.sprite.y;
        // Movement data
        this.input.angle = this.sprite.angle;
        this.input.rotation = this.sprite.rotation;
        this.input.angularVelocity = this.sprite.body.angularVelocity;
        this.input.acceleration = this.sprite.body.acceleration;
        this.input.currentSpeed = this.currentSpeed;
        console.log("Sending keys to server from ID: ", this.fingerprint);
        eurecaServer.handleKeys(this.input);
    }

    // This is where we finally update the sprites' movement, based on the `cursor` values, which are updated by the server previously
    if(this.cursor.up){
        game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 400, this.sprite.body.acceleration);
    }else if(this.cursor.down){
        game.physics.arcade.accelerationFromRotation(this.sprite.rotation, -400, this.sprite.body.acceleration);
    }else{
        this.sprite.body.acceleration.set(0);
    }
    if(this.cursor.left){
        this.sprite.body.angularVelocity = -400;
    }else if(this.cursor.right){
        this.sprite.body.angularVelocity = 400;
    }else{
        this.sprite.body.angularVelocity = 0;
    }
    if(this.cursor.fire && this.canFire){
        this.fire({
            x: this.cursor.tx,
            y: this.cursor.ty
        });
    }
    game.physics.arcade.overlap(this.sprite, bacon, collectBacon, null, this);

};

/** fire
 * TODO
 */
Player.prototype.fire = function(){
    if(!this.alive) return;
    // Check if we're within the proper fire rate window
    if(this.game.time.now > this.nextFire && this.bullets.countDead() > 0){
        // Set new fire time based on interval
        this.nextFire = this.game.time.now + this.fireRate;
        // Not sure what the rest does
        var bullet = this.bullets.getFirstDead();
        bullet.reset(this.sprite.body.x + 16, this.sprite.body.y + 16);
        game.physics.arcade.velocityFromRotation(this.sprite.rotation, 900, bullet.body.velocity);
    }
};

/**
 * TODO
 */
Player.prototype.kill = function(){
    this.alive = false;
    this.sprite.kill();
};

function collectBacon(player, piece){
  piece.kill();
  this.baconCount++;
  console.log(this.baconCount);
  scoreText.text = 'Bacon Count: ' + this.baconCount;
}
