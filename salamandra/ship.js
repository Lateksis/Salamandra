//
class Ship {

  constructor(game) {
    this.game = game;
    this.sprite = null;
    this.cursors = null;
    var shots = [];
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
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACE)) {
      shoot();
    }
  }

  shoot() {
    var bullet = this.game.add.sprite(this.sprite.x + 32, this.sprite.y + 8,'bullet');
    this.game.physics.enable(bullet);
    shots.push(bullet);

  }


}
