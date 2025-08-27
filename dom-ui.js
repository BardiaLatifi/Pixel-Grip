// Helper functions to manage DOM UI
export function connectUIListeners(game) {
  document.getElementById('button1').addEventListener('touchstart', () => {
    sendInputToScene(game, 'jump');
  });
  document.getElementById('button2').addEventListener('touchstart', () => {
    sendInputToScene(game, 'shoot');
  });
  document.getElementById('button3').addEventListener('touchstart', () => {
    sendInputToScene(game, 'run');
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
    color: '#303030',
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
  const overlay = document.getElementById('fullscreen-message');
  const holdTime = 600; // milliseconds to trigger
  let pressTimer = null;

  if (!btn || !overlay) return;

  btn.addEventListener('pointerdown', (e) => {
    pressTimer = setTimeout(() => {
      toggleFullscreen();
      pressTimer = null;
    }, holdTime);
  });

  const onPointerUpOrLeave = () => {
    if (pressTimer) {
      // user released before holdTime
      clearTimeout(pressTimer);
      pressTimer = null;
      // change overlay src to hint
      overlay.src = 'assets/ui/hold-it.png';
      // optional: revert back after short time
      setTimeout(() => {
        overlay.src = 'assets/ui/hold-fullscreen.png'; // original src
      }, 1200);
    }
  };

  btn.addEventListener('pointerup', onPointerUpOrLeave);
  btn.addEventListener('pointerleave', onPointerUpOrLeave);
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
