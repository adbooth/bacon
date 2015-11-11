var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });


        function preload () {

            game.load.image('background', 'assets/grid.png');
            game.load.image('bullet', 'assets/bullets.png');
            game.load.image('pig', 'assets/pig.png');
            game.load.image('bacon', 'assets/bacon.png');

        }
        var pig;
        var cursors;
        var bullet;
        var bullets;
        var bulletTime = 0;

        function create () {


            game.renderer.clearBeforeRender = false;
            game.renderer.roundPixels = true;

            //  We need arcade physics
            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.add.tileSprite(0, 0, 1920, 1920, 'background');

            game.world.setBounds(0, 0, 1920, 1920);



            //  Our ships bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        // Collectable Bacon
        bacon = game.add.group();
        bacon.enableBody = true;
         for (var i = 1; i < 50; i++)
    {
        //  Create a star inside of the 'stars' group
        var piece = bacon.create(i*100/2, i*100/2, 'bacon');

    }


        //  All 40 of them
        bullets.createMultiple(40, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);

        //  Our player pig (with camera follow)
        pig = game.add.sprite(game.center,0, 'pig');
        pig.anchor.set(0.5);
        game.camera.follow(pig);

        //  and its physics settings
        game.physics.enable(pig, Phaser.Physics.ARCADE);

        pig.body.drag.set(100);
        pig.body.maxVelocity.set(200);

        //  Game input
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    }

    function update() {

        //if a pig overlaps with something from the bacon object (pieces), call collectBacon
        game.physics.arcade.overlap(pig, bacon, collectBacon, null, this);

        if (cursors.up.isDown){
            game.physics.arcade.accelerationFromRotation(pig.rotation, 200, pig.body.acceleration);
        }
        else{
            pig.body.acceleration.set(0);
        }

        if (cursors.left.isDown){
            pig.body.angularVelocity = -150;
        }
        else if (cursors.right.isDown){
            pig.body.angularVelocity = 150;
        }
        else{
            pig.body.angularVelocity = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            fireBullet();
        }

       // screenWrap(pig);

        //bullets.forEachExists(screenWrap, this);

    }

    function collectBacon (pig, piece) {
        piece.kill();
    }

    function fireBullet () {

        if (game.time.now > bulletTime){
            bullet = bullets.getFirstExists(false);

            if (bullet){
                bullet.reset(pig.body.x + 16, pig.body.y + 16);
                bullet.lifespan = 2000;
                bullet.rotation = pig.rotation;
                game.physics.arcade.velocityFromRotation(pig.rotation, 400, bullet.body.velocity);
                bulletTime = game.time.now + 50;
            }
        }

    }



// function render() {

//     game.debug.cameraInfo(game.camera, game.centerx, game.centery);
//     game.debug.spriteInfo(sprite, 32, 32);

// }
