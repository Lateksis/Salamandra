class Ship extends Phaser.Sprite {
  constructor(game) {
    super(game, 20, 100, 'ship');
    this.selector = -1;
    this.speed = 0;
    this.fireRate = 0;
    this.damage = 0;
    this.option = 0;
    this.shield = 0;
    this.bulletTime = 0;
    this.shieldSprite = new Phaser.Sprite(this.game, 18, 98,'shield');
    this.shieldSprite.animations.add('shield_animation');
    this.game.physics.enable(this.shieldSprite);
    this.shieldSprite.kill();
  }

  update() {
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
        this.body.velocity.x -= 80 + this.speed;
      }
    }
    if (cursors.right.isDown) {
      if (this.x + 34 < this.game.camera.x + this.game.camera.width) {
        this.body.velocity.x += 80 + this.speed;
      }
    }
    if (cursors.up.isDown) {
      if (this.y - 2 > this.game.camera.y) {
        this.body.velocity.y -= 80 + this.speed;
      }
    }
    if (cursors.down.isDown) {
      if (this.y < this.game.camera.height - 80) {
        this.body.velocity.y += 80 + this.speed;
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
    weaponWheel.getChildAt(this.selector).frame = 1;
    if (this.selector == 0) {
      weaponText.setText('SPEED');
    }
    else if (this.selector == 1) {
      weaponText.setText('FIRESP');
    }
    else if (this.selector == 2) {
      weaponText.setText('POWER');
    }
    else if (this.selector == 3) {
      weaponText.setText('OPTION');
    }
    else if (this.selector == 4) {
      weaponText.setText('SHIELD');
    }
  }

  select_weapon() {
    if(this.selector == 0) {
      this.speed += 10;
      weaponWheel.getChildAt(0).frame = 0;
      this.selector = -1;
    }
    else if(this.selector == 1) {
      this.fireRate += 1;
      weaponWheel.getChildAt(1).frame = 0;
      this.selector = -1;
    }
    else if(this.selector == 2) {
      this.damage += 1;
      weaponWheel.getChildAt(2).frame = 0;
      this.selector = -1;
    }
    else if(this.selector == 3) {
      weaponWheel.getChildAt(3).frame = 0;
      this.selector = -1;
      this.add_option();
      this.option += 1;
    }
    else if(this.selector == 4) {
      this.shield += 1;
      weaponWheel.getChildAt(4).frame = 0;
      this.selector = -1;
      if (this.shield == 1) {
        this.add_shield();
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
