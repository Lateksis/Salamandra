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
    game.global = {
      ship : null,
      enemyBullets : null,
      bullets : null,
      options : null,
      cursors : null,
      space : null,
      m_key : null,
      weaponWheel : null,
      weaponText : null
    }

    var map;
    var layer;

    var screenDelay = 2; //The delay of screen scroll. Bigger values make scroll slower.
    var step = 2; //The step size for scrolling the screen
    var updateTimer; //Timer for counting how many times the update function has run.
    var score = 0;
    var enemies;
    var weaponTag;


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
      game.load.spritesheet('bullet', 'salamandra/img/shot.png', 8, 4);
      game.load.image('ship', 'salamandra/img/ship.png');
      game.load.image('dummy', 'salamandra/img/dummy.png');
      game.load.spritesheet('scout', 'salamandra/img/scout.png', 32, 32, 1);
      game.load.spritesheet('shooter', 'salamandra/img/shooting_enemy.png', 32, 32, 1);
      game.load.spritesheet('cannon', 'salamandra/img/cannon.png', 32, 32);
      game.load.spritesheet('enemy_bullet', 'salamandra/img/enemy_bullet.png', 6, 6, 4);
      game.load.spritesheet('ship_explode', 'salamandra/img/ship_explode.png', 32, 16);
      game.load.spritesheet('enemy_explode', 'salamandra/img/enemy_explode.png', 32, 32);
      game.load.spritesheet('powerup', 'salamandra/img/powerup.png', 32, 32);
      game.load.spritesheet('weapon_selector', 'salamandra/img/weapon_selector.png', 20, 10);
      game.load.image('weapon_tag', 'salamandra/img/weapon_tag.png');
      game.load.spritesheet('shield', 'salamandra/img/shield.png', 36, 20, 7);
      game.load.spritesheet('option', 'salamandra/img/option.png', 36, 18);
    }



    function create () {
      starfield = game.add.tileSprite(0,0,512,512, 'bg');
      map = game.add.tilemap('stage0');
      map.addTilesetImage('inside_ship', 'inside_ship');
      layer2 = map.createLayer('Background');
      layer2.smoothed = false;
      game.physics.startSystem(Phaser.Physics.ARCADE);
      //Create groups for different types of bodies
      //Bullets shot by player
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.createMultiple(30, 'bullet');

      //Explosions
      explosions = game.add.group();
      explosions.createMultiple(20, 'enemy_explode');

      //Powerups
      powerups = game.add.group();
      powerups.enableBody = true;
      powerups.createMultiple(20, 'powerup');

      //Options
      options = game.add.group();
      options.enableBody = true;
      options.createMultiple(5, 'option');

      //Enemy bullets
      enemyBullets = game.add.group();
      enemyBullets.enableBody = true;
      enemyBullets.createMultiple(30, 'enemy_bullet');
      //Enemies
      enemies = game.add.group();
      enemies.enableBody = true;

      updateTimer = 0;
      game.world.setBounds(0,0,11200,320);


      map.addTilesetImage('Design_tileset', 'tiles');
      map.addTilesetImage('ships', 'ship_tiles');
      layer = map.createLayer('Tile Layer 1');
      map.setCollisionBetween(0,20);
      //Create Ship
      //ship = game.add.sprite(20,100, 'ship');
      ship = new Ship(game);
      game.physics.enable(ship);
      game.add.existing(ship);
      game.add.existing(ship.shieldSprite);
      cursors = game.input.keyboard.createCursorKeys();
      space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      m_key = game.input.keyboard.addKey(Phaser.Keyboard.M);
      this.game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(function () {
        if (!game.paused) {
          pauseText.x = game.camera.x + 220;
          pauseText.visible = true;
          game.paused = true;
        }
        else {
          pauseText.visible = false;
          game.paused = false;
        }
      }, this);
      //Create HUD
      hudText = game.add.bitmapText(10, 350, 'font', 'Score : 0', 8);
      pauseText = game.add.bitmapText(270,150 , 'font', 'PAUSED', 16);
      pauseText.visible = false;

      weaponWheel = game.add.group();
      weaponWheel.createMultiple(5, 'weapon_selector', 0, true);
      weaponWheel.getChildAt(0).reset(20, 330);
      for (i = 1; i < 5; i++){
        weaponWheel.getChildAt(i).alignTo(weaponWheel.getChildAt(i-1), Phaser.RIGHT_TOP, 5);
      }
      weaponTag = game.add.sprite(125, 345, 'weapon_tag');
      weaponText = game.add.bitmapText(160, 348, 'font', ' ', 14);
      weaponText.tint = 0x000001;


      //Create enemies from object layer of the Tilemap
      // Loop over each object layer
      for (var ol in map.objects) {
        //Each object in objectLayer
        for (var o in map.objects[ol]) {
          var object = map.objects[ol][o];
          if (object.type == 'scout') {
            let enemy = new Scout(game,object.x,object.y);
            game.physics.enable(enemy);
            enemies.add(enemy);
          }
          else if (object.type == 'shooter') {
            let enemy = new Shooter(game,object.x,object.y);
            game.physics.enable(enemy);
            enemies.add(enemy);
          }
          else if (object.type == 'cannon') {
            let enemy = new Cannon(game,object.x,object.y, object.properties.orientation);
            game.physics.enable(enemy);
            enemies.add(enemy);
            enemy.body.immovable = true;
          }
        }
      }


    }

    function update () {
      if (!ship.exists) {
        return false;
      }
      // Check for collisions
      game.physics.arcade.collide(ship, layer, ship_hit_wall, null, this);
      game.physics.arcade.collide(enemies, layer);
      game.physics.arcade.collide(enemies, enemies);
      game.physics.arcade.collide(ship, enemies, bullet_hit_ship, null, this);
      game.physics.arcade.collide(ship, enemyBullets, bullet_hit_ship, null, this);
      game.physics.arcade.overlap(bullets, enemies, bullet_hit_enemy, null, this);
      game.physics.arcade.overlap(ship, powerups, pickup_powerup, null, this);
      game.physics.arcade.collide(bullets, layer, bullet_hit_wall, null, this);
      game.physics.arcade.collide(enemyBullets, layer, bullet_hit_wall, null, this);



      //Scroll screen
      if (updateTimer >= screenDelay) {
        game.camera.x += step;
        ship.body.x += step;
        ship.shieldSprite.x += step;
        updateTimer = 0;
        hudText.x += step;
        weaponText.x += step;
        starfield.x += step;
        weaponWheel.x += step;
        weaponTag.x += step;
        starfield.tilePosition.x -= 1;
        enemies.forEach(function(enemy) {
          if (!enemy.exists || !enemy.inCamera || enemy.orientation) {
            return false
          }
          enemy.x += step;
          }, this);
        options.forEachExists(function(opt) {
          opt.body.x += step;

        }, this);

      }
      updateTimer ++;

      //Kill bullets outside screen to preven offscreen kills
      bullets.forEachAlive(function(bullet) {
        if (bullet.x > game.camera.x + game.camera.width) {
          bullet.kill();
          map.layers[0].x -= 20;
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

      let explosion = explosions.getFirstExists(false);
      if (explosion) {
        explosion.reset(enemy.body.x, enemy.body.y);
        explosion.animations.add('enemy_explode')
        explosion.animations.play('enemy_explode', 60, false, true);
      }

      //TODO: remove this to be handled only by enemies who drop a powerup
      game.time.events.add(Phaser.Timer.SECOND * 1, spawn_powerup, this, enemy.body.x, enemy.body.y);
      //END TODO

      enemy.kill();
      hudText.setText('Score : ' + score);
    }
  }

  function bullet_hit_wall(bullet, wall) {
    //Destroy bullet on collision
    bullet.kill();
  }


  function bullet_hit_ship(ship, bullet) {
    //Destroy bullet and ship on collision
    bullet.kill();
    if (ship.shield == 0) {
      var explosion = game.add.sprite(ship.x, ship.y,'ship_explode');
      explosion.animations.add('explode')
      explosion.animations.play('explode', 60, false, true);
      ship.kill();
      options.forEach(function(opt) {
        opt.kill();
      }, this);
      game.time.events.add(Phaser.Timer.SECOND * 3, reset_game, this);
      //Wait for one second before resetting game
    }
    else {
      ship.damage_shield();
    }
  }

  function ship_hit_wall(ship, wall) {
    //Destroy ship on collision
    var explosion = game.add.sprite(ship.body.x - 32, ship.body.y,'ship_explode');
    explosion.animations.add('explode')
    explosion.animations.play('explode', 60, false, true);
    ship.kill();
    ship.shieldSprite.kill();
    options.forEach(function(opt) {
      opt.kill();
    }, this);
    game.time.events.add(Phaser.Timer.SECOND * 3, reset_game, this);
  }


  function reset_game() {
    //If ship has been destroyed, reset everything
    //Reset enemies on their spawn positions
    enemies.forEach(function(enemy) {
      enemy.reset(enemy.spawn_x, enemy.spawn_y);
      enemy.health = enemy.max_health;
    }, this);
    enemyBullets.forEach(function(bullet) {
      bullet.kill();
    }, this);
    powerups.forEach(function(powerup) {
      powerup.kill();
    }, this);
    game.camera.reset();
    ship.reset(20,100);
    hudText.reset(10, 350);
    weaponText.reset(160, 348);
    weaponTag.reset(125, 345);
    score = 0;
    hudText.setText('Score : ' + score);
    weaponWheel.x = 0;
    starfield.reset();
  }

  function spawn_powerup(x, y) {
    let powerup = powerups.getFirstExists(false);
    if (powerup) {
      powerup.reset(x,y);
      powerup.animations.add('powerup')
      powerup.animations.play('powerup', 3, true);
    }
  }

  function pickup_powerup(ship, powerup) {
    ship.next_weapon();
    powerup.kill();
  }

};
