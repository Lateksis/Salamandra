class TitleText extends Phaser.BitmapText {
  //Class for adding stage titles.
  constructor(game, x, y, text, lineNumber) {
    let size = 8
    if (lineNumber == 1) {
      size = 32;
    }
    super(game, x, y, 'font', text, size);
    this.speed = 6;
    this.lineNumber = lineNumber
    this.phase = 0;
    this.anchor.x = 0.5;
    this.fading = false;
    if (lineNumber == 1) {
      this.speed = -6;
    }
  }

  update() {
    if (this.phase == 0) {
      this.x += this.speed;
      if (this.x <= (game.camera.x + game.camera.width/2)  + 4 && this.x >= (game.camera.x + game.camera.width/2)  - 4) {
        this.phase = 1;
        game.time.events.add(Phaser.Timer.SECOND * 2, this.start_fading, this);
      }
    }
    else if (this.phase == 1) {
      if (this.fading) {
        this.alpha -= 0.005;
      }
      if (this.alpha == 0) {
        this.kill();
      }
    }
    return super.update();

  }

  start_fading() {
    this.fading = true;
    console.log("lol");
  }


}
