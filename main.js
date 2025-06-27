import { connectUIListeners, setupJoystick, setupFullscreenToggle } from './dom-ui.js';
import { Initialization } from './scenes/Initialization.js';
import { BootScene } from './scenes/BootScene.js';
import { DisplayManager } from './DisplayManager.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 640,
  height: 360,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Initialization, BootScene]
};

const game = new Phaser.Game(config);

window.addEventListener('load', () => {
  connectUIListeners(game);
  setupJoystick(game);
  setupFullscreenToggle(game);

  DisplayManager.initialize(game);
});

export default game;
