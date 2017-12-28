//
class Ship {

  constructor(game) {
    this.game = game;
    this.sprite = null;
  }

  preload() {
    this.game.load.image('bg', 'salamandra/img/space_bg.png');
    this.game.load.image('ship', 'salamandra/img/ship.png');
  }

  create() {
    this.sprite = game.add.sprite(0,0, 'ship');
    this.game.physics.enable(ship);
  }


}
