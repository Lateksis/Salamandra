/* DEBUG VARIABLES */
var noCollision = false;

  /* DEBUG FUNCTIONS */
function toggle_collision() {
  noCollision = document.getElementById("collision_box").value;
}

window.onload = function() {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(480, 320, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
    game.antialias = false;
    var ship;
    var cursors;

    var map;
    var layer;

    var screenDelay; //The delay of screen scroll. Bigger values make scroll slower.
    var updateTimer; //Timer for counting how many times the update function has run.
    var bulletTime = 0;

    var bullets;
    var enemyBullets;
    var enemies;

    var space;


    function preload () {
      this.game.load.image('bg', 'salamandra/img/space_bg.png');
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setMinMax(480, 320, 960, 640);
      game.load.tilemap('stage0', 'salamandra/img/stage_0.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles', 'salamandra/img/Design_tileset.png');
      game.load.image('bullet', 'salamandra/img/shot.png');
      game.load.image('ship', 'salamandra/img/ship.png');
      game.load.image('dummy', 'salamandra/img/dummy.png');
    }



    function create () {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      //Create groups for different types of bodies
      //Bullets shot by player
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.createMultiple(30, 'bullet');
      bullets.setAll('lifespan', 1500);

      //Enemy bullets
      enemyBullets = game.add.group();
      enemyBullets.enableBody = true;
      //Enemies
      enemies = game.add.group();
      enemies.enableBody = true;

      screenDelay = 20;
      updateTimer = 0;
      game.world.setBounds(0,0,11200,320);

      var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');
      logo.anchor.setTo(0.5, 0.5);

      map = game.add.tilemap('stage0');
      map.addTilesetImage('Design_tileset', 'tiles');
      layer = map.createLayer('Tile Layer 1');

      map.setCollisionBetween(0,5);
      //Create Ship
      ship = game.add.sprite(0,0, 'ship');
      game.physics.enable(ship);
      cursors = game.input.keyboard.createCursorKeys();
      space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      //Create dummy enemy
      enemies.add(game.add.sprite(300, 150, 'dummy'));
      //Create enemies from object layer of the Tilemap
      map.createFromObjects('objectgroup', 'Objects','dummy');

    }

    function update () {
      //Reset ship velocity
      ship.body.velocity.y = 0;
      ship.body.velocity.x = 0;
      //Controls
      if (cursors.left.isDown) {
        if (ship.x - 2 > game.camera.x) {
          ship.body.velocity.x -= 80;
        }
      }
      if (cursors.right.isDown) {
        if (ship.x + 34 < game.camera.x + game.camera.width) {
          ship.body.velocity.x += 80;
        }
      }
      if (cursors.up.isDown) {
        if (ship.y - 2 > game.camera.y) {
          ship.body.velocity.y -= 80;
        }
      }
      if (cursors.down.isDown) {
        if (ship.y + 18 < game.camera.y + game.camera.height) {
          ship.body.velocity.y += 80;
        }
      }
      if (space.isDown) {
        shoot();
      }
      //Scroll screen
      if (updateTimer >= screenDelay) {
        game.camera.x +=10;
        ship.body.velocity.x += 5;
        ship.body.x += 10;
        updateTimer = 0;
      }
      // Check for collisions
      game.physics.arcade.collide(ship, layer, ship_hit_wall, null, this);
      game.physics.arcade.overlap(bullets, enemies, bullet_hit_enemy, null, this);
      game.physics.arcade.collide(bullets, layer, bullet_hit_wall, null, this);
      //Destroy out of bounds bullets
      //Update step count
      updateTimer ++;

    }

    function render() {

    // game.debug.body(p);
    game.debug.bodyInfo(ship, 32, 32);

  }

  function bullet_hit_enemy(bullet, enemy) {
    //Destroy both enemy and bullet on collision
    bullet.kill();
    enemy.kill();
  }

  function bullet_hit_wall(bullet, wall) {
    //Destroy bullet on collision
    bullet.kill();
  }

  function ship_hit_wall(ship, wall) {
    //Destroy bullet on collision
    ship.kill();
  }


  function shoot() {
    if (game.time.now > bulletTime) {
      bullet = bullets.getFirstExists(false);
      if (bullet) {
        bullet.reset(ship.x + 32, ship.y + 8);
        bullet.body.velocity.x = 400;
        bullet.lifespan = 1500;
        bulletTime = game.time.now + 200
      }
    }
  }

};
