import { DisplayManager } from '../DisplayManager.js';

export class Initialization extends Phaser.Scene {
  constructor() {
    super('Initialization');
  }

  preload() {
    this.load.image('phaser-logo', 'assets/boot/phaser-logo.png');
    this.load.image('pixelgrip-logo', 'assets/boot/pixel-grip-logo.png');
    this.load.image('slogan', 'assets/boot/slogan.png');
    this.load.image('press-option', 'assets/boot/press-option.png');
  }

  create() {
    // Initialize DisplayManager with a callback to start BootScene
    DisplayManager.initialize(this.game, () => {
      console.log('[Initialization] Display ready, starting BootScene');
      this.scene.start('BootScene');
    });
  }
}
