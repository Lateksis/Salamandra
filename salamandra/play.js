var playState= {
    create: function () {

      starfield = game.add.tileSprite(0,0,512,512, 'bg');
      game.physics.startSystem(Phaser.Physics.ARCADE);
      map = game.add.tilemap('stage0');
      map.addTilesetImage('inside_ship', 'inside_ship');
      layer2 = map.createLayer('Background');
      layer2.smoothed = false;
      //Create groups for different types of bodies
      //Bullets shot by player
      bullets = game.add.group();
      bullets.enableBody = true;
      bullets.createMultiple(30, 'bullet');

      rockets = game.add.group();
      rockets.enableBody = true;
      rockets.createMultiple(30, 'rocket');

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
      game.world.setBounds(0,0,12512,320);


      map.addTilesetImage('Design_tileset', 'tiles');
      map.addTilesetImage('ships', 'ship_tiles');
      layer = map.createLayer('Tile Layer 1');
      layer.smoothed = false;

      //Create Ship
      ship = new Ship(game);
      game.physics.enable(ship);
      game.add.existing(ship);
      game.add.existing(ship.shieldSprite);
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
      scoreText = game.add.bitmapText(10, 350, 'font', '0', 16);
      pauseText = game.add.bitmapText(270,150 , 'font', 'PAUSED', 16);
      pauseText.visible = false;
      scoreText.tint = 0x00ffff;

      weaponWheel = game.add.group();
      weaponWheel.createMultiple(5, 'weapon_selector', 0, true);
      weaponWheel.getChildAt(0).reset(20, 330);
      for (i = 1; i < 5; i++){
        weaponWheel.getChildAt(i).alignTo(weaponWheel.getChildAt(i-1), Phaser.RIGHT_TOP, 5);
      }
      weaponTag = game.add.sprite(125, 345, 'weapon_tag');
      weaponText = game.add.bitmapText(160, 348, 'font', ' ', 14);
      weaponText.tint = 0x000001;
      scoreText.alignTo(weaponTag, Phaser.LEFT_TOP, 5);


      //Create enemies from object layer of the Tilemap
      // Loop over each object layer
      for (var ol in map.objects) {
        //Each object in objectLayer
        for (var o in map.objects[ol]) {
          var object = map.objects[ol][o];
          if (object.type == 'scout') {
            let enemy = new Scout(game,object.x,object.y);
          }
          else if (object.type == 'shooter') {
            let enemy = new Shooter(game,object.x,object.y);
          }
          else if (object.type == 'fleetship') {
            let enemy = new FleetShip(game,object.x,object.y, true);
          }
          else if (object.type == 'cannon') {
            let enemy = new Cannon(game,object.x,object.y, object.properties.orientation);
            enemy.getFrame();
          }
          else if (object.type == 'gate') {
            let enemy = new Gate(game,object.x,object.y, true, object.properties.size_up, object.properties.size_down);
          }
        }
      }
      //Transparent front layer
      layer3 = map.createLayer('Transparent');
      layer3.smoothed = false;

      map.setCollisionBetween(0, 99, true, layer);


    },

    update: function () {
      if (!ship.exists) {
        return false;
      }
      if (game.camera.x > 3600 && game.camera.x < 6820 && layer3.alpha > 0.2) {
      layer3.alpha -= 0.005;
      }
      if (game.camera.x > 6820 && layer3.alpha < 1) {
      layer3.alpha += 0.005;
      }
      // Check for collisions
      if (!noCollision) {
        game.physics.arcade.collide(ship, layer, ship_hit_wall, null, this);
        game.physics.arcade.collide(enemies, layer);
        game.physics.arcade.collide(enemies, enemies);
        game.physics.arcade.collide(ship, enemies, bullet_hit_ship, null, this);
        game.physics.arcade.collide(ship, enemyBullets, bullet_hit_ship, null, this);
        game.physics.arcade.overlap(bullets, enemies, bullet_hit_enemy, null, this);
        game.physics.arcade.overlap(ship, powerups, pickup_powerup, null, this);
        game.physics.arcade.collide(bullets, layer, bullet_hit_wall, null, this);
        game.physics.arcade.collide(enemyBullets, layer, bullet_hit_wall, null, this);
      }



      //Scroll screen
      if (updateTimer >= screenDelay) {
        updateTimer = 0;
        if ((game.camera.x + game.camera.width) < 12512) {
          game.camera.x += step;
          ship.body.x += step;
          ship.shieldSprite.x += step;
          scoreText.x += step;
          weaponText.x += step;
          starfield.x += step;
          weaponWheel.x += step;
          weaponTag.x += step;
          enemies.forEach(function(enemy) {
            if (!enemy.exists || !enemy.inCamera || enemy.body.immovable) {
              return false
            }
            enemy.x += step;
            }, this);
          options.forEachExists(function(opt) {
            opt.body.x += step;

          }, this);
        }
        starfield.tilePosition.x -= 1;
        if (turboMode) {
          screenDelay = 0;
        }


      }
      updateTimer ++;

      //Kill bullets outside screen to preven offscreen kills
      bullets.forEachAlive(function(bullet) {
        if (bullet.x > game.camera.x + game.camera.width) {
          bullet.kill();
          map.layers[0].x -= 20;
        }
      }, this);

    },

};


function bullet_hit_enemy(bullet, enemy) {
  //Destroy both enemy and bullet on collision
  bullet.kill();
  enemy.health -= 1;
  if (enemy.health <= 0) {
    enemy.kill();
    increase_score(enemy.score);
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
  scoreText.reset(10, 350);
  weaponText.reset(160, 348);
  weaponTag.reset(125, 345);
  score = 0;
  scoreText.setText(score);
  scoreText.alignTo(weaponTag, Phaser.LEFT_TOP, 5);
  weaponWheel.x = 0;
  layer3.alpha = 1;
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
  increase_score(150);
}

function increase_score(points) {
  score += points
  scoreText.setText(score);
  scoreText.alignTo(weaponTag, Phaser.LEFT_TOP, 5);
}
