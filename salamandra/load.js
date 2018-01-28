var loadState= {
  preload: function() {
    game.load.image('bg', 'salamandra/img/bg.png');
    game.load.bitmapFont('font', 'salamandra/img/font.png', 'salamandra/img/font.fnt' )
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setMinMax(540, 384, 1080, 768);
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    game.load.tilemap('stage0', 'salamandra/img/stage_0.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'salamandra/img/Design_tileset.png');
    game.load.image('ship_tiles', 'salamandra/img/ships.png');
    game.load.image('inside_ship', 'salamandra/img/inside_ship.png');
    game.load.spritesheet('bullet', 'salamandra/img/shot.png', 8, 4);
    game.load.image('ship', 'salamandra/img/ship.png');
    game.load.image('dummy', 'salamandra/img/dummy.png');
    game.load.spritesheet('scout', 'salamandra/img/scout.png', 32, 32, 1);
    game.load.spritesheet('fleetShip', 'salamandra/img/small_fleet.png', 36, 16);
    game.load.spritesheet('shooter', 'salamandra/img/shooting_enemy.png', 32, 32, 1);
    game.load.spritesheet('cannon', 'salamandra/img/cannon.png', 32, 32, 4);
    game.load.spritesheet('enemy_bullet', 'salamandra/img/enemy_bullet.png', 6, 6, 4);
    game.load.spritesheet('ship_explode', 'salamandra/img/ship_explode.png', 32, 16);
    game.load.spritesheet('enemy_explode', 'salamandra/img/enemy_explode.png', 32, 32);
    game.load.spritesheet('powerup', 'salamandra/img/powerup.png', 32, 32);
    game.load.spritesheet('weapon_selector', 'salamandra/img/weapon_selector.png', 20, 10);
    game.load.image('weapon_tag', 'salamandra/img/weapon_tag.png');
    game.load.spritesheet('shield', 'salamandra/img/shield.png', 36, 20, 7);
    game.load.spritesheet('option', 'salamandra/img/option.png', 36, 18);
    game.load.spritesheet('gate', 'salamandra/img/gate.png', 32, 32);
    game.load.spritesheet('gate_core', 'salamandra/img/gate_core.png', 32, 32, 6);
    game.load.spritesheet('rocket', 'salamandra/img/rocket.png', 20, 12, 3);
    game.load.spritesheet('spawner_up', 'salamandra/img/spawner_up.png', 64, 32);
    game.load.spritesheet('spawner_down', 'salamandra/img/spawner_down.png', 64, 32);
    game.load.spritesheet('stage_1_boss', 'salamandra/img/stage_1_boss.png', 32, 64);

    game.load.audio('pickup', 'salamandra/sound/power_pickup.wav');
    game.load.audio('select', 'salamandra/sound/select_powerup.wav');
    game.load.audio('fire_sound', 'salamandra/sound/weapon_fire.wav');
    game.load.audio('hit_sound', 'salamandra/sound/weapon_hit.wav');
    game.load.audio('explode_sound', 'salamandra/sound/enemy_explode.wav');
    game.load.audio('ship_explode_sound', 'salamandra/sound/ship_explode.wav');

    game.load.audio('stage_0_music', 'salamandra/sound/stage_0.ogg');


  },
  create: function() {
    cursors = game.input.keyboard.createCursorKeys();
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    m_key = game.input.keyboard.addKey(Phaser.Keyboard.M);
    z_key = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    x_key = game.input.keyboard.addKey(Phaser.Keyboard.X);
    game.state.start('menu');
  }
}
