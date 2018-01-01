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

    var game = new Phaser.Game(540, 384, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
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
      game.load.bitmapFont('font', 'salamandra/img/font.png', 'salamandra/img/font.fnt' )
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setMinMax(540, 384, 1080, 768);
      game.load.tilemap('stage0', 'salamandra/img/stage_0.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles', 'salamandra/img/Design_tileset.png');
      game.load.image('bullet', 'salamandra/img/shot.png');
      game.load.image('ship', 'salamandra/img/ship.png');
      game.load.image('dummy', 'salamandra/img/dummy.png');
      game.load.spritesheet('scout', 'salamandra/img/scout.png', 16, 16, 2);
      game.load.spritesheet('shooter', 'salamandra/img/shooting_enemy.png', 32, 32, 1);
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
      enemyBullets.createMultiple(30, 'bullet');
      enemyBullets.setAll('lifespan', 4000);
      //Enemies
      //This group is for basic scouts
      enemies = game.add.group();
      enemies.enableBody = true;
      //Stationary ships that fire at the player
      enemies2 = game.add.group();
      enemies2.enableBody = true;

      screenDelay = 2;
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
      //Create HUD getFirstExist
      hudText = game.add.bitmapText(500, 36, 'font', 'Test text', 32);

      //Create enemies from object layer of the Tilemap
      // Loop over each object layer
      for (var ol in map.objects) {
        //Each object in objectLayer
        for (var o in map.objects[ol]) {
          var object = map.objects[ol][o];
          if (object.type == 'ES1') {
            var enemy = game.add.sprite(object.x,object.y, 'scout');
            //Set an enemy type for this sprite, used when updating enemies
            enemies.add(enemy);
          }
          else if (object.type == 'ES2') {
            var enemy = game.add.sprite(object.x,object.y, 'shooter');
            //Set an enemy type for this sprite, used when updating enemies
            enemy.data = {fireDelay:0};
            enemies2.add(enemy);
          }
        }
      }


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
        if (ship.y < game.camera.height - 96) {
          ship.body.velocity.y += 80;
        }
      }
      if (space.isDown) {
        shoot();
      }
      //Update enemy movement

      enemies.forEach(function(enemy) {
        if (enemy.body.y < ship.body.y) {
          enemy.frame = 1;
          enemy.body.velocity.y = 40;
        }
        else if (enemy.body.y > ship.body.y) {
          enemy.frame = 1;
          enemy.body.velocity.y = -40;
        }
        else {
          enemy.frame = 0;
          enemy.body.velocity.y = 0;
        }
        enemy.body.velocity.x = -20;
      }, this);

      enemies2.forEach(function(enemy) {

        if (enemy.body.y < ship.body.y) {
          enemy.body.velocity.y = 40;
        }
        else if (enemy.body.y > ship.body.y) {
          enemy.body.velocity.y = -40;
        }
        else {
          enemy.body.velocity.y = 0;
        }
          if (game.time.now > enemy.data.fireDelay) {
            bullet = enemyBullets.getFirstExists(false);
            if (bullet) {
              bullet.reset(enemy.body.x, enemy.body.y + 2);
              bullet.body.velocity.x = -100;
              bullet.lifespan = 4000;
              //enemy.data.fireDelay = game.time.now + 100;
            }
            //also fire the second bullet
            bullet = enemyBullets.getFirstExists(false);
            if (bullet) {
              bullet.reset(enemy.body.x, enemy.body.y + 28);
              bullet.body.velocity.x = -100;
              bullet.lifespan = 4000;
              enemy.data.fireDelay = game.time.now + 1000;
            }
          }
        }, this);



      //Scroll screen
      if (updateTimer >= screenDelay) {
        game.camera.x +=2;
        ship.body.x += 2;
        updateTimer = 0;
        hudText.x +=2;
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
