//
class Ship {

  constructor(game) {
    this.game = game;
    this.sprite = null;
    this.cursors = null;
    this.space = null;
    this.shots = [];
    this.bulletTime = 0;
    this.bulletDelay = 10;
  }

  preload() {
    this.game.load.image('bg', 'salamandra/img/space_bg.png');
    this.game.load.image('ship', 'salamandra/img/ship.png');
    this.game.load.image('bullet', 'salamandra/img/shot.png');
  }

  create() {
    this.sprite = this.game.add.sprite(0,0, 'ship');
    this.game.physics.enable(this.sprite);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }

  update() {
    this.sprite.body.velocity.y = 0;
    this.sprite.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.sprite.body.velocity.x -= 80;
    }
    if (this.cursors.right.isDown) {
      this.sprite.body.velocity.x += 80;
    }
    if (this.cursors.up.isDown) {
      this.sprite.body.velocity.y -= 80;
    }
    if (this.cursors.down.isDown) {
      this.sprite.body.velocity.y += 80;
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
      bullet.body.velocity.x = 800;
      this.shots.push(bullet);
      this.bulletTime = 0;
    }

  }


}
