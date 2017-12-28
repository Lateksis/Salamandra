
class Enemy {

  constructor(game) {
    this.game = game;
    this.sprite = null;
    this.layer = null;
  }

  preload() {
    this.game.load.image('dummy', 'salamandra/img/dummy.png');
  }

}
