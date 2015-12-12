/* Player.js */

/**
 *
 */
Player = function(fingerprint, game, x, y){
    this.game = game;
    console.log("Creating", fingerprint, "'s sprite'");
    this.sprite = game.add.sprite(x, y, 'pig');
    this.fingerprint = this.sprite.id = fingerprint;
    this.alive = true;
    this.currentSpeed = 0;

    // Sprite initial values
    this.sprite.health = 3;
    this.sprite.angle = 0;
    this.sprite.anchor.set(0.5, 0.5);
    // Sprite physics
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.body.maxVelocity.set(200);
    this.sprite.body.drag.set(100);     // TODO look up this sprite field
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
 *
 */
Player.prototype.update = function(){
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
        // console.log("Sending keys to server from ID: ", this.fingerprint);
        eurecaServer.handleKeys(this.input);
    }

    // This is where we finally update the sprites' movement, based on the `cursor` values, which are updated by the server previously
    // TODO confirm the above is true
    if(this.cursor.up){
        game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 100000, this.sprite.body.acceleration);
    }else if(this.cursor.down){
        game.physics.arcade.accelerationFromRotation(this.sprite.rotation, -100000, this.sprite.body.acceleration);
    }else{
        this.sprite.body.acceleration.set(0);
    }
    if(this.cursor.left){
        this.sprite.body.angularVelocity -=3.6;
    }else if(this.cursor.right){
        this.sprite.body.angularVelocity += 3.6;
    }else{
        this.sprite.body.angularVelocity = 0;
    }
    if(this.cursor.fire && this.canFire){
        this.fire({
            x: this.cursor.tx,
            y: this.cursor.ty
        });
    }
};

/** fire
 *
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
        game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, bullet.body.velocity);
    }
};

/**
 *
 */
Player.prototype.kill = function(){
    this.alive = false;
    this.sprite.kill();
};
