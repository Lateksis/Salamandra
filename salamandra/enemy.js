
class Enemy extends Phaser.Sprite {
  constructor(game, x, y, sprite) {
    super(game, x, y, sprite);
    this.spawn_x = x;
    this.spawn_y = y;
  }

  stdUpdate() {
    //Function to tell if the enemy should be updated.
    if (!this.exists) {
      return false
    }

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
    //super(game, x, y, 'cannon');
    super(game, x, y - 32, 'cannon');
    this.health = 5;
    this.max_health = 5;
    this.fireDelay = 0;
    this.score = 1000;
    this.orientation = orientation;

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
