// Helper functions to manage DOM UI
export function connectUIListeners(game) {
  document.getElementById('jump-button').addEventListener('touchstart', () => {
    sendInputToScene(game, 'jump');
  });
  document.getElementById('shoot-button').addEventListener('touchstart', () => {
    sendInputToScene(game, 'shoot');
  });
}

function sendInputToScene(game, action) {
  const scene = game.scene.getScenes(true)[0];
  if (scene && scene.receiveInput) {
    scene.receiveInput(action);
  }
}

export function setupJoystick(game) {
  const joystick = nipplejs.create({
    zone: document.getElementById('joystick-container'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'black',
    restOpacity: 1,
  });
  joystick.on('move', (evt, data) => {
    if (data && data.vector) {
      const x = data.vector.x;
      const y = data.vector.y;
      const scene = game.scene.getScenes(true)[0];
      if (scene && scene.handleJoystick) {
        scene.handleJoystick(x, y);
      }
    }
  });
}

export function setupFullscreenToggle() {
  const btn = document.getElementById('full-screen-btn');
  let pressTimer = null;
  const holdTime = 600; // milliseconds to trigger

  if (!btn) return;

  btn.addEventListener('pointerdown', (e) => {
    pressTimer = setTimeout(() => {
      toggleFullscreen();
    }, holdTime);
  });

  btn.addEventListener('pointerup', () => clearTimeout(pressTimer));
  btn.addEventListener('pointerleave', () => clearTimeout(pressTimer));
}

function toggleFullscreen() {
  const el = document.getElementById('console-ui');

  if (!document.fullscreenElement) {
    el?.requestFullscreen().catch((err) => {
      console.warn('Failed to enter fullscreen:', err);
    });
  } else {
    document.exitFullscreen().catch((err) => {
      console.warn('Failed to exit fullscreen:', err);
    });
  }
}
