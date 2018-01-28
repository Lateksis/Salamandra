

var game = new Phaser.Game(540, 384, Phaser.AUTO, 'gameWindow');
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
var z_key;
var x_key;
var weaponWheel;
var weaponText;
var enemies;
var powerups;
var boss_killed = false;

var powerup_sound;
var select_sound;
var shoot_sound;
var hit_sound;
var explode_sound;
var ship_explode_sound;
var bg_music;

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
