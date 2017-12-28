//
class Ship {

  constructor(game) {
    this.game = game;
    this.sprite = null;
    this.cursors = null;
    this.layer = null;
    this.space = null;
    this.bulletTime = 0;
    this.bulletDelay = 30;
  }

  preload() {
    this.game.load.image('ship', 'salamandra/img/ship.png');
    this.game.load.image('bullet', 'salamandra/img/shot.png');
  }

  create(layer) {
    this.sprite = this.game.add.sprite(0,0, 'ship');
    this.game.physics.enable(this.sprite);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.layer = layer;
  }

  update() {
    this.game.physics.arcade.collide(this.sprite, this.layer);

    for (var i = 0; i < this.shots.length; i++) {
      this.game.physics.arcade.collide(this.shots[i], this.layer);
      if (this.shots[i].body.velocity.x == 0 || this.shots[i].body.x - this.sprite.body.x >= 500) {
        this.shots[i].exists = false;
        this.shots.splice(i, 1);
        i -= 1;
      }
    }

    this.sprite.body.velocity.y = 0;
    this.sprite.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      if (this.sprite.x - 2 > this.game.camera.x) {
        this.sprite.body.velocity.x -= 80;
      }
    }
    if (this.cursors.right.isDown) {
      if (this.sprite.x + 34 < this.game.camera.x + this.game.camera.width) {
        this.sprite.body.velocity.x += 80;
      }
    }
    if (this.cursors.up.isDown) {
      if (this.sprite.y - 2 > this.game.camera.y) {
        this.sprite.body.velocity.y -= 80;
      }
    }
    if (this.cursors.down.isDown) {
      if (this.sprite.y + 18 < this.game.camera.y + this.game.camera.height) {
        this.sprite.body.velocity.y += 80;
      }
    }
    if (this.space.isDown) {
      this.shoot();
    }
    this.bulletTime += 1;
  }

  shoot() {
    if (this.bulletTime >= this.bulletDelay) {
      var bullet = this.game.add.sprite(this.sprite.x + 32, this.sprite.y + 8,'bullet');
      this.game.physics.enable(bullet);
      bullet.body.velocity.x = 400;
      this.bulletTime = 0;
    }

  }


}
