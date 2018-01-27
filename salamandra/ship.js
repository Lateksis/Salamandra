class Ship extends Phaser.Sprite {
  constructor(game) {
    super(game, 20, 100, 'ship');
    this.selector = -1;
    this.speed = 0;
    this.fireRate = 0;
    this.power = 1;
    this.option = 0;
    this.shield = 0;
    this.bulletTime = 0;
    this.shieldSprite = new Phaser.Sprite(this.game, 18, 98,'shield');
    this.shieldSprite.animations.add('shield_animation');
    this.game.physics.enable(this.shieldSprite);
    this.shieldSprite.kill();
    this.previous_x = 0;
    this.previous_y = 0;
  }

  update() {
    if (!ship.exists) {
      return false;
    }
    //Reset ship velocity
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;
    if (this.shieldSprite.exists) {
      this.shieldSprite.body.velocity.x = 0;
      this.shieldSprite.body.velocity.y = 0;
    }
    //Controls
    if (cursors.left.isDown) {
      if (this.x - 2 > this.game.camera.x) {
        this.body.velocity.x -= 80 + this.speed * 10;
      }
    }
    if (cursors.right.isDown) {
      if (this.x + 34 < this.game.camera.x + this.game.camera.width) {
        this.body.velocity.x += 80 + this.speed * 10;
      }
    }
    if (cursors.up.isDown) {
      if (this.y - 2 > this.game.camera.y) {
        this.body.velocity.y -= 80 + this.speed * 10;
      }
    }
    if (cursors.down.isDown) {
      if (this.y < this.game.camera.height - 80) {
        this.body.velocity.y += 80 + this.speed * 10;
      }
    }
    if (space.isDown) {
      this.shoot();
    }
    if (m_key.isDown) {
      this.select_weapon();
    }
    if (this.shield > 0) {
      this.shieldSprite.body.velocity.x = this.body.velocity.x;
      this.shieldSprite.body.velocity.y = this.body.velocity.y;
    }

    options.forEachExists(function(opt) {
      opt.body.velocity.x = this.body.velocity.x;
      opt.body.velocity.y = this.body.velocity.y;

    }, this);
  }
  reset(x,y){
    weaponWheel.forEach(function(sel) {
      sel.frame = 0;
    }, this);
    weaponText.setText('');
    this.selector = -1;
    this.speed = 0;
    this.fireRate = 0;
    this.power = 1;
    this.option = 0;
    this.shield = 0;
    this.bulletTime = 0;
    return super.reset(x,y);
  }


  shoot() {
    if (this.game.time.now > this.bulletTime) {
      let bullet = bullets.getFirstExists(false);
      if (bullet) {
        bullet.reset(this.body.x + 32, this.body.y + 8);
        bullet.animations.add('glow');
        bullet.animations.play('glow', 10, true);
        bullet.body.velocity.x = 400;
        this.bulletTime = this.game.time.now + (400 - (this.fireRate * 20));
        options.forEachExists(function(opt) {
          bullet = bullets.getFirstExists(false);
          if (bullet) {
            bullet.reset(opt.body.x + 32, opt.body.y + 8);
            bullet.animations.add('glow');
            bullet.animations.play('glow', 10, true);
            bullet.body.velocity.x = 400;
          }
        }, this);
      }
    }
  }

  next_weapon() {
    if (!(this.selector == -1)) {
      weaponWheel.getChildAt(this.selector).frame = 0;
    }
    this.selector = (this.selector + 1) % 5;
    if (this.selector == 0) {
      if (this.speed >= 10) {
        this.selector += 1;
      }
      else {
        weaponText.setText('SPEED');
      }
    }
    if (this.selector == 1) {
      if (this.fireRate >= 5) {
        this.selector += 1;
      }
      else {
        weaponText.setText('FIRESP');
      }
    }
    if (this.selector == 2) {
      if (this.power >= 2) {
        this.selector += 1;
      }
      else {
        weaponText.setText('POWER');
      }
    }
    if (this.selector == 3) {
      if (this.option >= 2) {
        this.selector += 1;
      }
      else {
        weaponText.setText('OPTION');
      }
    }
    if (this.selector == 4) {
      if (this.shield >= 2) {
        this.selector = -1;
      }
      else {
        weaponText.setText('SHIELD');
      }
    }
    if (this.selector != -1) {
      weaponWheel.getChildAt(this.selector).frame = 1;
    }
  }

  select_weapon() {
    if(this.selector == 0) {
      this.speed += 1;
      weaponWheel.getChildAt(0).frame = 0;
      this.selector = -1;
      if (this.speed >= 10) {
        weaponWheel.getChildAt(0).frame = 2;
      }
    }
    else if(this.selector == 1) {
      this.fireRate += 1;
      weaponWheel.getChildAt(1).frame = 0;
      this.selector = -1;
      if (this.fireRate >= 5) {
        weaponWheel.getChildAt(1).frame = 2;
      }
    }
    else if(this.selector == 2) {
      this.power += 0.2;
      weaponWheel.getChildAt(2).frame = 0;
      this.selector = -1;
      if (this.power >= 2) {
        weaponWheel.getChildAt(2).frame = 2;
      }
    }
    else if(this.selector == 3) {
      weaponWheel.getChildAt(3).frame = 0;
      this.selector = -1;
      this.add_option();
      this.option += 1;
      if (this.option >= 2) {
        weaponWheel.getChildAt(3).frame = 2;
      }
    }
    else if(this.selector == 4) {
      this.shield += 1;
      weaponWheel.getChildAt(4).frame = 0;
      this.selector = -1;
      if (this.shield == 1) {
        this.add_shield();
      }
      if (this.shield >= 2) {
        weaponWheel.getChildAt(4).frame = 2;
      }
    }
    weaponText.setText(' ');
  }

  add_shield() {
    this.shieldSprite.reset(this.x - 2, this.y - 2);
    this.shieldSprite.animations.play('shield_animation', 5, true)
  }

  damage_shield() {
    this.shield -= 1;
    weaponWheel.getChildAt(4).frame = 1;
    if (this.shield == 0) {
      this.shieldSprite.kill();
    }
  }

  add_option() {
    let opt = options.getFirstExists(false);
    let x_pos = 0;
    let y_pos = 0;
    if (opt) {
      if (this.option == 0) {
        x_pos = this.body.x;
        y_pos = this.body.y + 32;
      }
      else if (this.option == 1) {
        x_pos = this.body.x;
        y_pos = this.body.y + - 32;
      }
      opt.reset(x_pos, y_pos);
      opt.animations.add('option_glow');
      opt.animations.play('option_glow', 10, true);
    }
  }

}

class Rocket extends Phaser.Sprite {
  constructor(game) {
    super(game, 0, 0, 'rocket');
  }


}
