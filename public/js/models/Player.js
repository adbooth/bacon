/* Player.js */

/** Player
 * Class represents a player object for the game, with reference to a Phaser sprite object
 */
Player = function(game, fingerprint, username, x, y){
    this.game = game;
    this.username = username;
    this.sprite = this.game.add.sprite(x, y, 'pig');
    this.sprite.animations.add('up', [0, 1, 2, 3], 12);
    this.sprite.animations.add('down', [4, 5, 6, 7], 12);
    this.sprite.animations.add('left', [11, 10, 9, 8], 12);
    this.sprite.animations.add('right', [12, 13, 14, 15], 12);

    this.sprite.name = this.username;
    this.fingerprint = this.sprite.id = fingerprint;
    this.alive = true;

    // Username setup
    this.usernameLabel = this.game.add.text(0, -30, '<' + this.username + '>', {
        font: "15px Arial",
        fill: "#000000"
    });
    this.usernameLabel.anchor.set(0.5, 0.5);
    this.sprite.addChild(this.usernameLabel);

    // Sprite initial values
    this.sprite.health = 3;
    this.sprite.angle = 0;
    this.sprite.anchor.set(0.5, 0.5);
    // Sprite physics
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.body.maxVelocity.set(200);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(0, 0);
    // game.physics.arcade.velocityFromRotation(this.sprite.rotation, 0, this.sprite.body.velocity);

    // Bullet business
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(20, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.fireRate = 400;
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
        eurecaServer.handleKeys(this.input);
    }

    // This is where we finally update the sprites' movement, based on the `cursor` values, which are updated by the server previously
    if(this.cursor.up){
        this.sprite.y -= 3;
        this.sprite.animations.play('up');
    }
    if(this.cursor.down){
        this.sprite.y += 3;
        this.sprite.animations.play('down');
    }
    if(this.cursor.left){
        this.sprite.x -= 3;
        this.sprite.animations.play('left');
    }
    if(this.cursor.right){
        this.sprite.x += 3;
        this.sprite.animations.play('right');
    }
    if(this.cursor.fire){
        this.fire();
    }
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
        bullet.reset(this.sprite.x - 8, this.sprite.y - 8);
        game.physics.arcade.moveToPointer(bullet, 300);
    }
};

/**
 * TODO
 */
Player.prototype.getHit = function(){
    console.log(this.fingerprint, "was hit");
    this.health--;
    if(this.health < 1){
        this.alive = false;
        this.kill();
    }
};

/**
 * TODO
 */
Player.prototype.kill = function(){
    this.alive = false;
    this.sprite.kill();
};
