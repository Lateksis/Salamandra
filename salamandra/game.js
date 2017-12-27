window.onload = function() {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(480, 320, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var ship;
    var cursors;

    function preload () {

      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setMinMax(400, 300, 800, 600);

      game.load.image('bg', 'salamandra/img/space_bg.png');
      game.load.image('ship', 'salamandra/img/ship.png');
      game.load.tilemap('stage1', 'salamandra/img/stage_1.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles', 'salamandra/img/stage1_tileset.png');

    }

    var map;
    var layer;

    function create () {

      game.world.setBounds(0,0,1200,320);

        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');
        logo.anchor.setTo(0.5, 0.5);

        map = game.add.tilemap('stage1');
        map.addTilesetImage('stage1_tileset', 'tiles');
        layer = map.createLayer('Tile Layer 1');

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

      game.camera.x +=2;


    }
};
