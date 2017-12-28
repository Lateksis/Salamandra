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
    var ship;
    var cursors;

    var screenDelay; //The delay of screen scroll. Bigger values make scroll slower.
    var updateTimer; //Timer for counting how many times the update function has run.


    function preload () {

      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setMinMax(480, 320, 960, 640);

      game.load.image('bg', 'salamandra/img/space_bg.png');
      game.load.image('ship', 'salamandra/img/ship.png');
      game.load.tilemap('stage0', 'salamandra/img/stage_0.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('tiles', 'salamandra/img/Design_tileset.png');

    }

    var map;
    var layer;

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

      ship = game.add.sprite(0,0, 'ship');

      game.physics.enable(ship);
      cursors = game.input.keyboard.createCursorKeys();

    }

    function update () {
      game.physics.arcade.collide(ship, layer);

      ship.body.velocity.y = 0;
      ship.body.velocity.x = 0;

      if (cursors.left.isDown) {
        ship.body.velocity.x -= 80;
      }
      if (cursors.right.isDown) {
        ship.body.velocity.x += 80;
      }
      if (cursors.up.isDown) {
        ship.body.velocity.y -= 80;
      }
      if (cursors.down.isDown) {
        ship.body.velocity.y += 80;
      }
      if (updateTimer >= screenDelay) {
        game.camera.x +=10;
        ship.body.velocity.x += 5;
        ship.body.x += 10;
        updateTimer = 0;
      }
      if (check_collision()) {

      }
      updateTimer ++; //Update step count

    }

    function render() {

    // game.debug.body(p);
    game.debug.bodyInfo(ship, 32, 32);

  }

  function check_collision() {
    if (!noCollision) {
      if (ship.body.touching.up || ship.body.touching.down || ship.body.touching.left || ship.body.touching.right) {
        return true;
      }
    }
    return false;
    //Checks if the ship has collided with the map
  }

};
