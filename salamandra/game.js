/* DEBUG VARIABLES */
var noCollision = false;

  /* DEBUG FUNCTIONS */
function toggle_collision() {
  noCollision = document.getElementById("collision_box").value;
}
var game = new Phaser.Game(540, 384, Phaser.AUTO, '');
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.antialias = false;

var ship;
var enemyBullets;
var bullets;
var rockets;
var options;
var cursors;
var space;
var m_key;
var weaponWheel;
var weaponText;
var enemies;

var map;
var layer;

var screenDelay = 2; //The delay of screen scroll. Bigger values make scroll slower.
var step = 2; //The step size for scrolling the screen
var updateTimer; //Timer for counting how many times the update function has run.
var score = 0;
var weaponTag;


window.onload = function() {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    game.state.start('load');

};
