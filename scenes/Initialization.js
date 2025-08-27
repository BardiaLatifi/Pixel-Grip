import { DisplayManager } from '../tools/DisplayManager.js';

export class Initialization extends Phaser.Scene {
  constructor() {
    super('Initialization');
  }

  preload() {
    // Boot
    this.load.image('phaser-logo', 'assets/boot/phaser-logo.png');
    this.load.image('pixelgrip-logo', 'assets/boot/pixel-grip-logo.png');
    this.load.image('slogan', 'assets/boot/slogan.png');
    this.load.image('press-option', 'assets/boot/press-option.png');

    // ***** THIS ASSETS LOAD IS FOR DEBUG SCENE AND MUST DELETE AFTER DEBUGGING

    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

    // *** Root Assets ***
    this.load.image('background-root', 'assets/main-menu/bg-root.png');

    this.load.spritesheet('fire-root', 'assets/main-menu/fire-root.png', {
      frameWidth: 120,
      frameHeight: 80
    });

    // *** Options Assets ***
    this.load.spritesheet('options-enter', 'assets/main-menu/options-enter.png', {
      frameWidth: 640,
      frameHeight: 360
    });
    this.load.spritesheet('options-loop', 'assets/main-menu/options-loop.png', {
      frameWidth: 640,
      frameHeight: 360
    });
    this.load.spritesheet('options-exit', 'assets/main-menu/options-exit.png', {
      frameWidth: 640,
      frameHeight: 360
    });

    // *** About Assets ***
    this.load.image('background-about', 'assets/main-menu/bg-about.png');

    this.load.spritesheet('fire-about', 'assets/main-menu/fire-about.png', {
      frameWidth: 208,
      frameHeight: 144
    });

    // the Paper
    this.load.image('paper-static', 'assets/main-menu/paper-static.png');

    this.load.spritesheet('paper-expand', 'assets/main-menu/paper-expand.png', {
      frameWidth: 480,
      frameHeight: 270
    });

    this.load.spritesheet('paper-collapse', 'assets/main-menu/paper-collapse.png', {
      frameWidth: 480,
      frameHeight: 270
    });

    this.load.image('paper', 'assets/main-menu/paper.png');

    // **** Sound Effects ****//
    this.load.audio('sfx_hover', 'assets/main-menu/audio/hover.wav');
    this.load.audio('sfx_select', 'assets/main-menu/audio/select.wav');
    this.load.audio('sfx_fire', 'assets/main-menu/audio/fire.mp3');
    this.load.audio('sfx_wind', 'assets/main-menu/audio/wind.mp3');
    this.load.audio('sfx_torch-up', 'assets/main-menu/audio/torch-up.wav');
    this.load.audio('sfx_torch-down', 'assets/main-menu/audio/torch-down.wav');
    this.load.audio('sfx_text', 'assets/main-menu/audio/text.wav');
  }

  create() {
    // Register this scene as current for DisplayManager
    DisplayManager.currentSceneKey = this.scene.key;

    // Initialize display state with callback
    DisplayManager.initialize(this.game, () => {
      const targetScene = window.DEBUG_SCENE || 'BootScene';
      console.log(`[Initialization] Display ready, starting ${targetScene}`);
      this.scene.start(targetScene);
    });
  }
}
