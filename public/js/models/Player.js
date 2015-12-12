/* Player.js */
Player = function(fingerprint, game, x, y){
    this.game = game;
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

Player.prototype.update = function(){
    // Detect a change input between client and server states
    var inputChanged = (
        this.cursor.left != this.input.left ||
        this.cursor.right != this.input.right ||
        this.cursor.up != this.input.up ||
        this.cursor.down != this.input.down ||
        this.cursor.fire != this.input.fire
    );

    if(inputChanged){
        if(this.fingerprint == myFingerprint){
            // Location data
            this.input.x = this.sprite.x;
            this.input.y = this.sprite.y;
            // Movement data
            this.input.angle = this.sprite.angle;
            this.input.rotation = this.sprite.rotation;
            this.input.angularVelocity = this.sprite.body.angularVelocity;
            this.input.acceleration = this.sprite.body.acceleration;
            this.input.currentSpeed = this.currentSpeed;
            eurecaServer.handleKeys(this.input);
        }
    }
};
