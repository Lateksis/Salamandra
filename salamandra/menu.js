var menuState = {
  create:function() {
    var title = game.add.bitmapText(100,150 , 'font', 'SALAMANDRA', 32);
    var start = game.add.bitmapText(100,250 , 'font', 'Press space to start', 16);
    space.onDown.addOnce(this.start, this);
  },

  start: function () {
    game.state.start('play');
  }
}
