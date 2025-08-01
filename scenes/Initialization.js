import { DisplayManager } from '../tools/DisplayManager.js';

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
