
class Enemy extends Phaser.Sprite {
  constructor(game) {
    super(game, 0, 0, "dummy");
    this.exist = false;
    this.game.physics.enable(this);
    this.active = false;
  }

  stdUpdate() {
    //Function to tell if the enemy should be updated.
    if (!this.exists) {
      return false
    }

  }
}



class Scout extends Enemy {
  constructor(game) {
    super(game);

  }
}
