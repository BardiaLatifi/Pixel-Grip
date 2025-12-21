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



    // *** Root Assets ***
    this.load.image('background-root', 'assets/main-menu/Themes/Mythological-1/bg-root.png');

    this.load.spritesheet('fire-root', 'assets/main-menu/Themes/Mythological-1/fire-root.png', {
      frameWidth: 120,
      frameHeight: 80
    });

    this.load.spritesheet('space-background-root', 'assets/main-menu/Themes/Space-1/space-background-root.png', {
      frameWidth: 640,
      frameHeight: 360
    });

    // *** Options Assets ***
    this.load.spritesheet('options-enter', 'assets/main-menu/Themes/Mythological-1/options-enter.png', {
      frameWidth: 640,
      frameHeight: 360
    });
    this.load.spritesheet('options-loop', 'assets/main-menu/Themes/Mythological-1/options-loop.png', {
      frameWidth: 640,
      frameHeight: 360
    });
    this.load.spritesheet('options-exit', 'assets/main-menu/Themes/Mythological-1/options-exit.png', {
      frameWidth: 640,
      frameHeight: 360
    });

    // *** About Assets ***
    this.load.image('background-about', 'assets/main-menu/Themes/Mythological-1/bg-about.png');

    this.load.spritesheet('fire-about', 'assets/main-menu/Themes/Mythological-1/fire-about.png', {
      frameWidth: 208,
      frameHeight: 144
    });

    // the Paper
    this.load.image('paper-Myth-1', 'assets/main-menu/Themes/Mythological-1/paper.png');
    this.load.image('paper-Space-1', 'assets/main-menu/Themes/Space-1/paper.png');

    // **** Sound Effects ****// 
    {
      // ** Boot Scene
      this.load.audio('sfx_intro', 'assets/boot/audio/intro.mp3');
      this.load.audio('sfx_accept', 'assets/boot/audio/accept.mp3');

      // ** Mythological Theme
      {
        // UI Sound Packs

        this.load.audio('hammer1_hover', 'assets/main-menu/audio/hammer-1/hover.wav');
        this.load.audio('hammer1_select', 'assets/main-menu/audio/hammer-1/select.wav');
        this.load.audio('hammer1_back', 'assets/main-menu/audio/hammer-1/back.wav');
        this.load.audio('hammer1_text', 'assets/main-menu/audio/hammer-1/text.wav');

        this.load.audio('hammer2_hover', 'assets/main-menu/audio/hammer-2/hover.wav');
        this.load.audio('hammer2_select', 'assets/main-menu/audio/hammer-2/select.wav');
        this.load.audio('hammer2_back', 'assets/main-menu/audio/hammer-2/back.wav');
        this.load.audio('hammer2_text', 'assets/main-menu/audio/hammer-2/text.wav');

        this.load.audio('fight1_hover', 'assets/main-menu/audio/fight-1/hover.wav');
        this.load.audio('fight1_select', 'assets/main-menu/audio/fight-1/select.wav');
        this.load.audio('fight1_back', 'assets/main-menu/audio/fight-1/back.wav');
        this.load.audio('fight1_text', 'assets/main-menu/audio/fight-1/text.wav');

        this.load.audio('fight2_hover', 'assets/main-menu/audio/fight-2/hover.wav');
        this.load.audio('fight2_select', 'assets/main-menu/audio/fight-2/select.wav');
        this.load.audio('fight2_back', 'assets/main-menu/audio/fight-2/back.wav');
        this.load.audio('fight2_text', 'assets/main-menu/audio/fight-2/text.wav');

        // Environment
        this.load.audio('sfx_fire', 'assets/main-menu/audio/fire.mp3');
        this.load.audio('sfx_wind', 'assets/main-menu/audio/wind.mp3');
        this.load.audio('sfx_torch-up', 'assets/main-menu/audio/torch-up.wav');
        this.load.audio('sfx_torch-down', 'assets/main-menu/audio/torch-down.wav');

        // Musics
        this.load.audio('Track-1', 'assets/main-menu/audio/music/dramatic-cello.mp3');
        this.load.audio('Track-2', 'assets/main-menu/audio/music/one-eyed-salmon.mp3');
        this.load.audio('Track-3', 'assets/main-menu/audio/music/the-star-of-the-county-down.mp3');
      }

      // ** Space Theme
      {
        // UI Sound Packs
        this.load.audio('digital1_hover', 'assets/main-menu/audio/digital-1/hover.wav');
        this.load.audio('digital1_select', 'assets/main-menu/audio/digital-1/select.wav');
        this.load.audio('digital1_back', 'assets/main-menu/audio/digital-1/back.wav');
        this.load.audio('digital1_text', 'assets/main-menu/audio/digital-1/text.wav');

        this.load.audio('digital2_hover', 'assets/main-menu/audio/digital-2/hover.wav');
        this.load.audio('digital2_select', 'assets/main-menu/audio/digital-2/select.wav');
        this.load.audio('digital2_back', 'assets/main-menu/audio/digital-2/back.wav');
        this.load.audio('digital2_text', 'assets/main-menu/audio/digital-2/text.wav');

        // Music
        this.load.audio('Space-Track-1', 'assets/main-menu/audio/music/Soft-Background-Music.mp3');
        this.load.audio('Space-Track-2', 'assets/main-menu/audio/music/beautiful-piano.mp3');
      }
    }

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
