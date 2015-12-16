var myId= 0;
var bulletTime = 0;

var land;

var pig;
var player;
var pigsList;

var cursors;

var bullets;
var fireRate= 250;
var nextFire= 0;

var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
	//create an instance of eureca.io client
	var eurecaClient = new Eureca.Client();

	eurecaClient.ready(function (proxy) {
		eurecaServer = proxy;
	});



	//methods defined under "exports" namespace become available in the server side

	eurecaClient.exports.setId = function(id)
	{
		//create() is moved here to make sure nothing is created before uniq id assignation
		myId = id;
		create();
		eurecaServer.handshake();
		ready = true;
	};

	eurecaClient.exports.kill = function(id)
	{
		if (pigsList[id]) {
			pigsList[id].kill();
			console.log('killing ', id, pigsList[id]);
		}
	};

	eurecaClient.exports.spawnEnemy = function(i, x, y)
	{

		if (i == myId) return; //this is me

		console.log('SPAWN');
		var pige = new Pig(i, game, pig);
		console.log(pige.health);
		pigsList[i] = pige;
	};

	eurecaClient.exports.updateState = function(id, state)
	{
		if (pigsList[id])  {
			pigsList[id].cursor = state;
			pigsList[id].pig.x = state.x;
			pigsList[id].pig.y = state.y;
			pigsList[id].pig.body.angularVelocity = state.angularVelocity;
			pigsList[id].pig.angle = state.angle;

			pigsList[id].pig.rotation = state.rotation;
			pigsList[id].currentSpeed = state.currentSpeed;
			pigsList[id].update();
		}
	};
};

Pig = function (index, game, player) {
	this.cursor = {
		left:false,
		right:false,
		up:false,
		down:false,
		fire:false
	};

	this.input = {
		left:false,
		right:false,
		up:false,
		down:false,
		fire:false
	};

  var x = 0;
  var y = 0;

  this.game = game;
  this.player = player;
  this.bullets = game.add.group();
  this.bullets.enableBody = true;
  this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
  this.bullets.createMultiple(20, 'bullet', 0, false);
  this.bullets.setAll('anchor.x', 0.5);
  this.bullets.setAll('anchor.y', 0.5);
  this.bullets.setAll('outOfBoundsKill', true);
  this.bullets.setAll('checkWorldBounds', true);
  this.canFire = true;

  this.currentSpeed =0;
  this.fireRate = 500;
  this.nextFire = 0;
  this.alive = true;

	this.pig = game.add.sprite(x, y, 'pig');
	this.pig.anchor.set(0.5, 0.5);
	this.pig.health = 3;

  this.pig.id = index;
  game.physics.enable(this.pig, Phaser.Physics.ARCADE);
	this.pig.body.immovable = false;
  this.pig.body.maxVelocity.set(200);
	this.pig.body.drag.set(100);
  this.pig.body.collideWorldBounds = true;
  this.pig.body.bounce.setTo(0, 0);

  this.pig.angle = 0;
  game.physics.arcade.velocityFromRotation(this.pig.rotation, 0, this.pig.body.velocity);
};

Pig.prototype.update = function() {
  var inputChanged = (
		this.cursor.left != this.input.left ||
		this.cursor.right != this.input.right ||
		this.cursor.up != this.input.up ||
		this.cursor.down != this.input.down ||
		this.cursor.fire != this.input.fire
	);

  if (inputChanged)
	{
		//Handle input change here
		//send new values to the server
		if (this.pig.id == myId)
		{
			// send latest valid state to the server
			this.input.x = this.pig.x;
			this.input.y = this.pig.y;
			this.input.angle = this.pig.angle;
			this.input.rotation = this.pig.rotation;
			this.input.angularVelocity= this.pig.body.angularVelocity;
			this.input.currentSpeed= this.currentSpeed;
			this.input.acceleration = this.pig.body.acceleration;
	   	eurecaServer.handleKeys(this.input);

		}
	}
  //cursor value is now updated by eurecaClient.exports.updateState method
	//  The speed we'll travel at
		if (this.cursor.up) {
			game.physics.arcade.accelerationFromRotation(this.pig.rotation, 100000, this.pig.body.acceleration);
		}
		else if (this.cursor.down) {
			game.physics.arcade.accelerationFromRotation(this.pig.rotation, -100000, this.pig.body.acceleration);
		}
		else{
						this.pig.body.acceleration.set(0);
				}

		if (this.cursor.left) this.pig.body.angularVelocity -= 3.6;

    else if (this.cursor.right) this.pig.body.angularVelocity += 3.6;

		else {
			this.pig.body.angularVelocity = 0;
		}

    if (this.cursor.fire && this.canFire){
			this.fire({x:this.cursor.tx, y:this.cursor.ty});
		}
    // if (this.currentSpeed > 0) game.physics.arcade.velocityFromRotation(this.pig.rotation, this.currentSpeed, this.pig.body.velocity);
    // else game.physics.arcade.velocityFromRotation(this.pig.rotation, 0, this.pig.body.velocity);
};

  Pig.prototype.fire = function() {
				if (!this.alive) return;
				if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.pig.body.x + 16, this.pig.body.y + 16);

						game.physics.arcade.velocityFromRotation(this.pig.rotation, 400,bullet.body.velocity);

        }
	};

  Pig.prototype.kill = function() {
    this.alive = false;
    this.pig.kill();
};

  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: eurecaClientSetup, update: update });
        function preload () {

            game.load.image('background', 'assets/grid.png');
            game.load.image('bullet', 'assets/bullets.png');
            game.load.image('pig', 'assets/pig.png');
            game.load.image('bacon', 'assets/bacon.png');

        }


        function create () {

            game.world.setBounds(-1000, -1000, 2000, 2000);
            game.stage.disableVisibilityChange  = true;

            //  Our tiled scrolling background
            land = game.add.tileSprite(0, 0, 800, 600, 'background');
            land.fixedToCamera = true;

            pigsList = {};

            player = new Pig(myId, game, pig);
            pigsList[myId] = player;
            pig = player.pig;
            pig.x=0;
            pig.y=0;
            bullets = player.bullets;

            pig.bringToTop();

            game.camera.follow(pig);

            game.renderer.clearBeforeRender = false;
            game.renderer.roundPixels = true;

            cursors = game.input.keyboard.createCursorKeys();



        // Collectable Bacon
        // bacon = game.add.group();
        // bacon.enableBody = true;
        //  for (var i = 1; i < 50; i++){
        //  //  Create a star inside of the 'stars' group
        //  var piece = bacon.create(i*100/2, i*100/2, 'bacon');
        //  }


        //  All 40 of them
        bullets.createMultiple(40, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);

        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    }

    function update() {

        //if a pig overlaps with something from the bacon object (pieces), call collectBacon
        //game.physics.arcade.overlap(pig, bacon, collectBacon, null, this);

        //do not update if client not ready
        if (!ready) return;
        player.input.left = cursors.left.isDown;
        player.input.right = cursors.right.isDown;
        player.input.up = cursors.up.isDown;
				player.input.down = cursors.down.isDown;
        player.input.fire = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
        player.input.tx = game.input.x+ game.camera.x;
        player.input.ty = game.input.y+ game.camera.y;
        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;

        for (var i in pigsList){
      		if (!pigsList[i]) continue;
      		var curBullets = pigsList[i].bullets;
      		var curPig = pigsList[i].pig;

    		  for (var j in pigsList){
    			     if (!pigsList[j]) continue;
    			        if (j!=i){
    				            var targetPig = pigsList[j].pig;
    				            game.physics.arcade.overlap(curBullets, targetPig, bulletHitPlayer, null, this);
    			        }
    			if (pigsList[j].alive) pigsList[j].update();
    		  }
        }
    }

		function bulletHitPlayer (pig, bullet) {
		    bullet.kill();
				pig.health--;
				if(pig.health <= 0) pig.kill();

		}

    function collectBacon (pig, piece) {
        piece.kill();
    }
