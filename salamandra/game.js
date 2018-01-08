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
    var score = 0;

    var bullets;
    var enemyBullets;
    var enemies;

    var space;


    function preload () {
      this.game.load.image('bg', 'salamandra/img/bg.png');
      game.load.bitmapFont('font', 'salamandra/img/font.png', 'salamandra/img/font.fnt' )
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setMinMax(540, 384, 1080, 768);
      game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
      game.load.tilemap('stage0', 'salamandra/img/stage_0.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles', 'salamandra/img/Design_tileset.png');
      game.load.image('ship_tiles', 'salamandra/img/ships.png');
      game.load.image('inside_ship', 'salamandra/img/inside_ship.png');
      game.load.image('bullet', 'salamandra/img/shot.png');
      game.load.image('ship', 'salamandra/img/ship.png');
      game.load.image('dummy', 'salamandra/img/dummy.png');
      game.load.spritesheet('scout', 'salamandra/img/scout.png', 32, 32, 1);
      game.load.spritesheet('shooter', 'salamandra/img/shooting_enemy.png', 32, 32, 1);
      game.load.spritesheet('cannon', 'salamandra/img/cannon.png', 32, 32);
      game.load.spritesheet('enemy_bullet', 'salamandra/img/enemy_bullet.png', 6, 6, 4);
      game.load.spritesheet('ship_explode', 'salamandra/img/ship_explode.png', 32, 16);
    }



    function create () {
      starfield = game.add.tileSprite(0,0,512,512, 'bg');
      map = game.add.tilemap('stage0');
      map.addTilesetImage('inside_ship', 'inside_ship');
      layer2 = map.createLayer('Background');
      game.physics.startSystem(Phaser.Physics.ARCADE);
      //Create groups for different types of bodies
      //Bullets shot by player
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.createMultiple(30, 'bullet');

      //Enemy bullets
      enemyBullets = game.add.group();
      enemyBullets.enableBody = true;
      enemyBullets.createMultiple(30, 'enemy_bullet');
      //Enemies
      //This group is for basic scouts
      enemies = game.add.group();
      enemies.enableBody = true;
      //Stationary ships that fire at the player
      enemies2 = game.add.group();
      enemies2.enableBody = true;
      //Cannons mounted on ships
      enemies3 = game.add.group();
      enemies3.enableBody = true;

      screenDelay = 2;
      updateTimer = 0;
      game.world.setBounds(0,0,11200,320);


      map.addTilesetImage('Design_tileset', 'tiles');
      map.addTilesetImage('ships', 'ship_tiles');
      layer = map.createLayer('Tile Layer 1');
      map.setCollisionBetween(0,20);
      //Create Ship
      ship = game.add.sprite(20,100, 'ship');
      game.physics.enable(ship);
      cursors = game.input.keyboard.createCursorKeys();
      space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      //Create HUD getFirstExist
      hudText = game.add.bitmapText(10, 350, 'font', 'Score : 0', 8);

      //Create enemies from object layer of the Tilemap
      // Loop over each object layer
      for (var ol in map.objects) {
        //Each object in objectLayer
        for (var o in map.objects[ol]) {
          var object = map.objects[ol][o];
          if (object.type == 'scout') {
            let enemy = game.add.sprite(object.x,object.y, 'scout');
            game.physics.enable(enemy);
            //Set an enemy type for this sprite, used when updating enemies
            enemy.data = {fireDelay:0, max_health:1, spawn_x:object.x, spawn_y:object.y};
            enemies.add(enemy);
          }
          else if (object.type == 'shooter') {
            let enemy = game.add.sprite(object.x,object.y, 'shooter');
            game.physics.enable(enemy);
            //Set an enemy type for this sprite, used when updating enemies
            enemy.data = {fireDelay:0, max_health:2, spawn_x:object.x, spawn_y:object.y};
            enemy.health = 2;
            enemies2.add(enemy);
          }
          else if (object.type == 'cannon') {
            let enemy = game.add.sprite(object.x,object.y - 32, 'cannon');
            //Check cannon orientation
            let ori = object.properties.orientation
            if (ori == 'left') {
              enemy.frame = 3;
            }
            //Set an enemy type for this sprite, used when updating enemies
            enemy.data = {fireDelay:0, max_health:5, spawn_x:object.x, spawn_y:object.y - 32};
            enemy.health = 5;
            enemies3.add(enemy);
          }
        }
      }


    }

    function update () {


      if (!ship.exists) {
        return false;
      }
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
        if (ship.y < game.camera.height - 64) {
          ship.body.velocity.y += 80;
        }
      }
      if (space.isDown) {
        shoot();
      }
      //Update enemy movement

      enemies.forEach(function(enemy) {
        if (!enemy.exists || !enemy.inCamera) {
          return false
        }
        if (ship.body.y - enemy.body.y > 10 ) {
          enemy.body.velocity.y = 60;
        }
        else if (enemy.body.y - ship.body.y > 10) {
          enemy.body.velocity.y = -60;
        }
        else {
          enemy.body.velocity.y = 0;
        }
        enemy.body.velocity.x = -20;
      }, this);

      enemies2.forEach(function(enemy) {
        if (!enemy.exists || !enemy.inCamera) {
          return false
        }
        // Follow player on y axis
        if (ship.body.y - enemy.body.y > 10 ) {
          enemy.body.velocity.y = 100;
        }
        else if (enemy.body.y - ship.body.y > 10) {
          enemy.body.velocity.y = -100;
        }
        else {
          enemy.body.velocity.y = 0;
        }
        //Keep proper distance on x axis
        if (enemy.body.x >= (game.camera.x + game.camera.width - 32)) {
          enemy.body.velocity.x = -100;
        }
        else if (enemy.body.x - ship.body.x > 300) {
          enemy.body.velocity.x = -100;
        }
        else if (enemy.body.x - ship.body.x < 250) {
          enemy.body.velocity.x = 100;
        }
        enemy.body.x += 2;
          if (game.time.now > enemy.data.fireDelay) {
            bullet = enemyBullets.getFirstExists(false);
            if (bullet) {
              bullet.reset(enemy.body.x, enemy.body.y + 2);
              bullet.animations.add('glow');
              bullet.animations.play('glow', 30, true);
              bullet.body.velocity.x = -100;
              bullet.lifespan = 4000;
              //enemy.data.fireDelay = game.time.now + 100;
            }
            //also fire the second bullet
            bullet = enemyBullets.getFirstExists(false);
            if (bullet) {
              bullet.reset(enemy.body.x, enemy.body.y + 28);
              bullet.animations.add('glow');
              bullet.animations.play('glow', 30, true);
              bullet.body.velocity.x = -100;
              bullet.lifespan = 4000;
              enemy.data.fireDelay = game.time.now + 1000;
            }
          }
        }, this);

        enemies3.forEach(function(enemy) {
          if (!enemy.exists || !enemy.inCamera) {
            return false
          }
          let dist_x = enemy.body.x - ship.body.x;
          let dist_y = enemy.body.y - ship.body.y;
            if (game.time.now > enemy.data.fireDelay && dist_x <= 300 && dist_x > 10 ) {
              bullet = enemyBullets.getFirstExists(false);
              if (bullet) {
                bullet.reset(enemy.body.x, enemy.body.y + 12);
                bullet.animations.add('glow');
                bullet.animations.play('glow', 30, true);
                bullet.body.velocity.x = -dist_x;
                bullet.body.velocity.y = -dist_y;
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
        starfield.x += 2;
        starfield.tilePosition.x -= 1;
      }
      //scroll bg

      // Check for collisions
      game.physics.arcade.collide(ship, layer, ship_hit_wall, null, this);
      game.physics.arcade.collide(enemies, layer);
      game.physics.arcade.collide(enemies2, layer);
      game.physics.arcade.collide(ship, enemyBullets, bullet_hit_ship, null, this);
      game.physics.arcade.overlap(bullets, enemies, bullet_hit_enemy, null, this);
      game.physics.arcade.overlap(bullets, enemies2, bullet_hit_enemy, null, this);
      game.physics.arcade.overlap(bullets, enemies3, bullet_hit_enemy, null, this);
      game.physics.arcade.collide(bullets, layer, bullet_hit_wall, null, this);
      game.physics.arcade.collide(enemyBullets, layer, bullet_hit_wall, null, this);
      //Destroy out of bounds bullets
      //Update step count
      updateTimer ++;

      //Kill bullets outside screen to preven offscreen kills
      bullets.forEachAlive(function(bullet) {
        if (bullet.x > game.camera.x + game.camera.width) {
          bullet.kill();

        }
      }, this);

    }

    function render() {

  }

  function bullet_hit_enemy(bullet, enemy) {
    //Destroy both enemy and bullet on collision
    bullet.kill();
    enemy.health -= 1;
    if (enemy.health <= 0) {
      score += enemy.data.max_health * 100;
      enemy.kill();
      hudText.setText('Score : ' + score);
    }
  }

  function bullet_hit_wall(bullet, wall) {
    //Destroy bullet on collision
    bullet.kill();
  }

  function bullet_hit_ship(bullet, ship) {
    //Destroy bullet and ship on collision
    var explosion = game.add.sprite(ship.x - 32, ship.y - 8,'ship_explode');
    explosion.animations.add('explode')
    explosion.animations.play('explode', 60, false, true);
    bullet.kill();
    ship.kill();
    game.time.events.add(Phaser.Timer.SECOND * 3, reset_game, this);
    //Wait for one second before resetting game
  }

  function ship_hit_wall(ship, wall) {
    //Destroy ship on collision
    var explosion = game.add.sprite(ship.x - 32, ship.y - 8,'ship_explode');
    explosion.animations.add('explode')
    explosion.animations.play('explode', 60, false, true);
    ship.kill();
    game.time.events.add(Phaser.Timer.SECOND * 3, reset_game, this);
  }


  function shoot() {
    if (game.time.now > bulletTime) {
      bullet = bullets.getFirstExists(false);
      if (bullet) {
        bullet.reset(ship.x + 32, ship.y + 8);
        bullet.body.velocity.x = 400;
        bulletTime = game.time.now + 400
      }
    }
  }

  function reset_game() {
    //If ship has been destroyed, reset everything
    //Reset enemies on their spawn positions
    enemies.forEach(function(enemy) {
      enemy.reset(enemy.data.spawn_x, enemy.data.spawn_y);
      enemy.health = enemy.data.max_health;
    }, this);
    enemies2.forEach(function(enemy) {
      enemy.reset(enemy.data.spawn_x, enemy.data.spawn_y);
      enemy.health = enemy.data.max_health;
    }, this);
    enemies3.forEach(function(enemy) {
      enemy.reset(enemy.data.spawn_x, enemy.data.spawn_y);
      enemy.health = enemy.data.max_health;
    }, this);
    enemyBullets.forEach(function(bullet) {
      bullet.kill();
    }, this);
    game.camera.reset();
    ship.reset(20,100);
    hudText.reset(10, 350);
    score = 0;
    hudText.setText('Score : ' + score);
    starfield.reset();
  }

};
