import { connectUIListeners, setupJoystick, setupFullscreenToggle } from './dom-ui.js';
import { DisplayManager } from './DisplayManager.js';
import { Initialization } from './scenes/Initialization.js';
import { BootScene } from './scenes/BootScene.js';
import { MainMenuScene } from './scenes/MainMenu.js'

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 640,
  height: 360,
  scene: [Initialization, BootScene, MainMenuScene]
};

const game = new Phaser.Game(config);

window.addEventListener('load', () => {
  connectUIListeners(game);
  setupJoystick(game);
  setupFullscreenToggle(game);

  DisplayManager.initialize(game);
});

export default game;
