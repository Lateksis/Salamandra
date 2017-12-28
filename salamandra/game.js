/* DEBUG VARIABLES */
var noCollision = false;

  /* DEBUG FUNCTIONS */
function toggle_collision() {
  noCollision = document.getElementById("collision_box").value;
}

window.onload = function() {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(480, 320, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
    game.antialias = false;
    var ship = new Ship(game);
    var cursors;

    var map;
    var layer;

    var screenDelay; //The delay of screen scroll. Bigger values make scroll slower.
    var updateTimer; //Timer for counting how many times the update function has run.


    function preload () {

      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setMinMax(480, 320, 960, 640);
      ship.preload();
      game.load.tilemap('stage0', 'salamandra/img/stage_0.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles', 'salamandra/img/Design_tileset.png');

    }



    function create () {

      screenDelay = 20;
      updateTimer = 0;
      game.world.setBounds(0,0,11200,320);

      var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');
      logo.anchor.setTo(0.5, 0.5);

      map = game.add.tilemap('stage0');
      map.addTilesetImage('Design_tileset', 'tiles');
      layer = map.createLayer('Tile Layer 1');

      game.physics.startSystem(Phaser.Physics.ARCADE);
      map.setCollisionBetween(0,5);

      ship.create();

      cursors = game.input.keyboard.createCursorKeys();

    }

    function update () {
      game.physics.arcade.collide(ship.sprite, layer);

      ship.sprite.body.velocity.y = 0;
      ship.sprite.body.velocity.x = 0;

      if (cursors.left.isDown) {
        ship.sprite.body.velocity.x -= 80;
      }
      if (cursors.right.isDown) {
        ship.sprite.body.velocity.x += 80;
      }
      if (cursors.up.isDown) {
        ship.sprite.body.velocity.y -= 80;
      }
      if (cursors.down.isDown) {
        ship.sprite.body.velocity.y += 80;
      }
      if (updateTimer >= screenDelay) {
        game.camera.x +=10;
        ship.sprite.body.velocity.x += 5;
        ship.sprite.body.x += 10;
        updateTimer = 0;
      }
      if (check_collision()) {

      }
      updateTimer ++; //Update step count

    }

    function render() {

    // game.debug.body(p);
    game.debug.bodyInfo(ship.sprite, 32, 32);

  }

  function check_collision() {
    if (!noCollision) {
      if (ship.sprite.body.touching.up || ship.sprite.body.touching.down || ship.sprite.body.touching.left || ship.sprite.body.touching.right) {
        return true;
      }
    }
    return false;
    //Checks if the ship has collided with the map
  }

};
