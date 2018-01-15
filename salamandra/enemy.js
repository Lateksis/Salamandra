
class Enemy extends Phaser.Sprite {
  constructor(game, x, y, sprite) {
    super(game, x, y, sprite);
    this.spawn_x = x;
    this.spawn_y = y;
    game.physics.enable(this);
    enemies.add(this);
  }
  kill() {
    let explosion = explosions.getFirstExists(false);
    if (explosion) {
      explosion.reset(this.body.x, this.body.y);
      explosion.animations.add('enemy_explode')
      explosion.animations.play('enemy_explode', 60, false, true);
    }
    if (this.dropPowerUp) {
      game.time.events.add(Phaser.Timer.SECOND * 0.5, spawn_powerup, this, this.body.x, this.body.y);
    }
    return super.kill();
  }

  stdUpdate() {
    //Function to tell if the enemy should be updated.
    if (!this.exists) {
      return false
    }

  }
}

class FleetShip extends Enemy {
  constructor(game, x, y, is_leader) {
    super(game, x, y, 'fleetShip');
    this.health = 1;
    this.max_health = 1;
    this.is_leader = is_leader;
    this.score = 100;
    if (this.is_leader) {
      this.dropPowerUp = true;
      this.frame = 1;
      let wingman = new FleetShip(game, x + 20, y - 20 , false);
      this.game.physics.enable(wingman);
      enemies.add(wingman);
      wingman = new FleetShip(game, x + 20, y + 20 , false);
      this.game.physics.enable(wingman);
      enemies.add(wingman);
    }


  }

  update() {
    if (!this.exists || !this.inCamera) {
      return false
    }
    this.body.velocity.y = 0;
    this.body.velocity.x = -120;
  }
}



class Scout extends Enemy {
  constructor(game, x, y) {
    super(game, x, y, 'scout');
    this.health = 1;
    this.max_health = 1;
    this.score = 100;

  }

  update() {
    if (!this.exists || !this.inCamera) {
      return false
    }
    if (ship.body.y - this.body.y > 10 ) {
      this.body.velocity.y = 60;
    }
    else if (this.body.y - ship.body.y > 10) {
      this.body.velocity.y = -60;
    }
    else {
      this.body.velocity.y = 0;
    }
    this.body.velocity.x = -80;
  }
}





class Shooter extends Enemy {
  constructor(game, x, y) {
    super(game, x, y, 'shooter');
    this.health = 4;
    this.max_health = 4;
    this.fireDelay = 0;
    this.score = 500;
    this.dropPowerUp = true;

  }

update() {
    if (!this.exists || !this.inCamera) {
      return false
    }
    // Follow player on y axis
    if (ship.body.y - this.body.y > 10 ) {
      this.body.velocity.y = 100;
    }
    else if (this.body.y - ship.body.y > 10) {
      this.body.velocity.y = -100;
    }
    else {
      this.body.velocity.y = 0;
    }
    //Keep proper distance on x axis
    if (this.body.x >= (this.game.camera.x + this.game.camera.width - 32)) {
      this.body.velocity.x = -100;
    }
    else if (this.body.x - ship.body.x > 300) {
      this.body.velocity.x = -100;
    }
    else if (this.body.x - ship.body.x < 250) {
      this.body.velocity.x = 100;
    }
      if (this.game.time.now > this.fireDelay) {
        let bullet = enemyBullets.getFirstExists(false);
        if (bullet) {
          bullet.reset(this.body.x, this.body.y + 2);
          bullet.animations.add('glow');
          bullet.animations.play('glow', 10, true);
          bullet.body.velocity.x = -100;
          bullet.lifespan = 4000;
          //enemy.data.fireDelay = game.time.now + 100;
        }
        //also fire the second bullet
        bullet = enemyBullets.getFirstExists(false);
        if (bullet) {
          bullet.reset(this.body.x, this.body.y + 28);
          bullet.animations.add('glow');
          bullet.animations.play('glow', 10, true);
          bullet.body.velocity.x = -100;
          bullet.lifespan = 4000;
          this.fireDelay = this.game.time.now + 1000;
        }
      }
    }
}




class Cannon extends Enemy {
  constructor(game, x, y, orientation) {
    super(game, x, y - 32, 'cannon');
    this.body.immovable = true;
    this.health = 5;
    this.max_health = 5;
    this.fireDelay = 0;
    this.score = 1000;
    this.orientation = orientation;
    this.dropPowerUp = true;

  }

  getFrame() {
    if (this.orientation == 'left') {
      this.frame = 3;
    }
  }

  update() {
    if (!this.exists || !this.inCamera) {
      return false
    }
    let dist_x = this.body.x - ship.body.x;
    let dist_y = this.body.y - ship.body.y;
      if (this.game.time.now > this.fireDelay && dist_x <= 300 && dist_x > 10 ) {
        let bullet = enemyBullets.getFirstExists(false);
        if (bullet) {
          bullet.reset(this.body.x, this.body.y + 12);
          bullet.animations.add('glow');
          bullet.animations.play('glow', 10, true);
          bullet.body.velocity.x = -dist_x;
          bullet.body.velocity.y = -dist_y;
          bullet.lifespan = 4000;
          this.fireDelay = this.game.time.now + 1000;
        }
      }
    }
  }



    class Gate extends Enemy {
      constructor(game, x, y, isCore, size_up, size_down) {
        if (isCore) {
          super(game, x, y - 32, 'gate_core');
          this.health = 10; //The core is the only weak spot
          this.max_health = 10;
          this.animations.add('gate_core_glow');
          this.animations.play('gate_core_glow', 10, true);
        }
        else {
          super(game, x, y - 32, 'gate');
          this.health = 100;
          this.max_health = 100;
          this.animations.add('gate_glow');
          this.animations.play('gate_glow', 10, true);
        }
        this.body.immovable = true;
        this.fireDelay = 0;
        this.score = 1500;
        this.dropPowerUp = false;
        this.isCore = isCore;

        //If this is the core, create other instances recursively to both sides thus creating a gate
        let nextGate = null;
        if (size_up > 0) {
          nextGate = new Gate(game, x, y - 32, false, size_up - 1, 0);
          game.physics.enable(nextGate);
          enemies.add(nextGate);
          this.rightGate = nextGate;
        }
        if (size_down > 0) {
          nextGate = new Gate(game, x, y + 32, false, 0, size_down - 1);
          game.physics.enable(nextGate);
          enemies.add(nextGate);
          this.leftGate = (nextGate);
        }

      }

      kill() {
        if (this.rightGate) {
          game.time.events.add(Phaser.Timer.SECOND * 0.2, this.kill, this.rightGate);
        }
        if (this.leftGate) {
          game.time.events.add(Phaser.Timer.SECOND * 0.2, this.kill, this.leftGate);
        }
        return super.kill();
      }



      update() {
        if (!this.exists || !this.inCamera) {
          return false
        }
      }
}
