window.onload = function() {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var ship;
    var cursors;

    function preload () {

        game.load.image('bg', 'img/space_bg.png');
        game.load.image('ship', 'img/ship.png');

    }

    function create () {

        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');
        logo.anchor.setTo(0.5, 0.5);
        ship = game.add.sprite(0,0, 'ship');
        cursors = game.input.keyboard.createCursorKeys();

    }

    function update () {
      if (cursors.left.isDown) {
        ship.x -= 4;
      }
      if (cursors.right.isDown) {
        ship.x += 4;
      }
      if (cursors.up.isDown) {
        ship.y -= 4;
      }
      if (cursors.down.isDown) {
        ship.y += 4;
      }

    }
};
