
class Enemy extends Phaser.Sprite {
  constructor(game) {
    super(game, 0, 0, "dummy");
    this.exist = false;
    this.game.physics.enable(this);
  }
}



class Scout extends Enemy {
  constructor(game) {
    super(game);
    
  }
}
