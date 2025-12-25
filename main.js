import { connectUIListeners, setupJoystick, setupFullscreenToggle } from './dom-ui.js';
import { DisplayManager } from './tools/DisplayManager.js';

import { Initialization } from './scenes/Initialization.js';
import { BootScene } from './scenes/BootScene.js';
import { MainMenuScene } from './scenes/MainMenu.js'

// === Debugging Control ===
const DEBUG_SCENE = null; // Set to null to use full flow (BootScene etc.)
window.DEBUG_SCENE = DEBUG_SCENE;    // Expose for scene logic if needed

// === Dynamic Scene List ===
const SCENES = DEBUG_SCENE
  ? [Initialization, MainMenuScene] // Skip BootScene during debug
  : [Initialization, BootScene, MainMenuScene];


const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 640,
  height: 360,
  scene: SCENES
};

const game = new Phaser.Game(config);

window.addEventListener('load', () => {
  connectUIListeners(game);
  setupJoystick(game);
  setupFullscreenToggle(game);

  DisplayManager.initialize(game);
});

export default game;
