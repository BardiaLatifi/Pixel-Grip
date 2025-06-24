import { connectUIListeners, setupJoystick, setupFullscreenToggle } from './dom-ui.js';
import { Initialization } from './scenes/Initialization.js';
import { BootScene } from './scenes/BootScene.js';

// Phaser game configuration
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


// Initialize Phaser
const game = new Phaser.Game(config);

// Once DOM is ready, hook up UI
window.addEventListener('load', () => {
  connectUIListeners(game);
  setupJoystick(game);
  setupFullscreenToggle();

});

console.log('Phaser version:', Phaser.VERSION);


export default game;