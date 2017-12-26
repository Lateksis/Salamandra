window.onload = function() {

    //  Note that this html file is set to pull down Phaser 2.5.0 from the JS Delivr CDN.
    //  Although it will work fine with this tutorial, it's almost certainly not the most current version.
    //  Be sure to replace it with an updated version before you start experimenting with adding your own code.

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload () {

        game.load.image('bg', 'img/space_bg.png');

    }

    function create () {

        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');
        logo.anchor.setTo(0.5, 0.5);

    }

    function update () {


    }
};
