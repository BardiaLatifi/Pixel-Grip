import { connectUIListeners, setupJoystick, setupFullscreenToggle } from './dom-ui.js';
import { DisplayManager } from './DisplayManager.js';
import { Initialization } from './scenes/Initialization.js';
import { BootScene } from './scenes/BootScene.js';
import { MainMenuScene } from './scenes/MainMenu.js'

// Temp scene for debug
// const DEBUG_SCENE = 'MainMenuScene';
const DEBUG_SCENE = null;

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 640,
  height: 360,
  scene: [Initialization, BootScene, MainMenuScene]
};

const game = new Phaser.Game(config);

// === TEMP SCENE JUMP === //
if (DEBUG_SCENE) {
  game.scene.start(DEBUG_SCENE);
}

window.addEventListener('load', () => {
  connectUIListeners(game);
  setupJoystick(game);
  setupFullscreenToggle(game);

  DisplayManager.initialize(game);
});

export default game;
