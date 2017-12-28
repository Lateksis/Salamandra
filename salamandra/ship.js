//
class Ship {

  var spaceKey;
  var game;
  var cursors;

  constructor(game) {
    game = game;
    this.sprite = null;
    var shots = [];
  }

  preload() {
    game.load.image('bg', 'salamandra/img/space_bg.png');
    game.load.image('ship', 'salamandra/img/ship.png');
    game.load.image('bullet', 'salamandra/img/shot.png');
  }

  create() {
    this.sprite = game.add.sprite(0,0, 'ship');
    game.physics.enable(this.sprite);
    cursors = game.input.keyboard.createCursorKeys();
  }

  update() {
    this.sprite.body.velocity.y = 0;
    this.sprite.body.velocity.x = 0;

    if (cursors.left.isDown) {
      this.sprite.body.velocity.x -= 80;
    }
    if (cursors.right.isDown) {
      this.sprite.body.velocity.x += 80;
    }
    if (cursors.up.isDown) {
      this.sprite.body.velocity.y -= 80;
    }
    if (cursors.down.isDown) {
      this.sprite.body.velocity.y += 80;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACE)) {
      shoot();
    }
  }

  shoot() {
    var bullet = game.add.sprite(this.sprite.x + 32, this.sprite.y + 8,'bullet');
    game.physics.enable(bullet);
    shots.push(bullet);

  }


}
