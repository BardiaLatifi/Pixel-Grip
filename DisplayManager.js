export const DisplayManager = {
  game: null,
  currentSceneKey: null,
  rotateImage: null,
  fullscreenImage: null,
  onReadyCallback: null,

  initialize(game, onReadyCallback) {
    this.game = game;
    this.onReadyCallback = onReadyCallback;

    this.rotateImage = document.getElementById('rotate-image');
    this.fullscreenImage = document.getElementById('fullscreen-message');

    if (!this.rotateImage || !this.fullscreenImage) {
      console.warn('DisplayManager: Missing DOM overlays (rotate-image or fullscreen-message)');
    }

    // Track active scene key on transitions
    game.events.on('transitionstart', (fromScene, toScene) => {
      this.currentSceneKey = toScene.scene.key;
      console.log(`[DisplayManager] Transitioned to scene: ${this.currentSceneKey}`);
    });

    // Initial evaluation
    this.evaluateDisplayState();

    // Listen for resize, orientation and fullscreen changes
    window.addEventListener('resize', () => this.evaluateDisplayState());
    window.addEventListener('orientationchange', () => this.evaluateDisplayState());
    document.addEventListener('fullscreenchange', () => this.evaluateDisplayState());
  },

  evaluateDisplayState() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const isFullscreen = document.fullscreenElement !== null;

    console.log('[DisplayManager] Evaluating display state...');
    console.log(` - Portrait: ${isPortrait}`);
    console.log(` - Fullscreen: ${isFullscreen}`);

    if (isPortrait) {
      this.showOverlay(this.rotateImage);
      this.hideOverlay(this.fullscreenImage);
      this.pauseGame();
    } else if (!isFullscreen) {
      this.showOverlay(this.fullscreenImage);
      this.hideOverlay(this.rotateImage);
      this.pauseGame();
    } else {
      this.hideOverlay(this.rotateImage);
      this.hideOverlay(this.fullscreenImage);
      this.resumeGame();

      if (this.onReadyCallback) {
        console.log('[DisplayManager] Display ready callback triggered');
        this.onReadyCallback();
        this.onReadyCallback = null; // prevent repeated calls
      }
    }
  },

  pauseGame() {
    if (this.currentSceneKey) {
      console.log(`[DisplayManager] Pausing scene: ${this.currentSceneKey}`);
      this.game.scene.pause(this.currentSceneKey);
    } else {
      console.warn('[DisplayManager] No active scene to pause');
    }
  },

  resumeGame() {
    if (this.currentSceneKey) {
      console.log(`[DisplayManager] Resuming scene: ${this.currentSceneKey}`);
      this.game.scene.resume(this.currentSceneKey);
    } else {
      console.warn('[DisplayManager] No active scene to resume');
    }
  },

  showOverlay(el) {
    if (el) {
      el.style.display = 'block';
      console.log(`[DisplayManager] Showing overlay: ${el.id}`);
    }
  },

  hideOverlay(el) {
    if (el) {
      el.style.display = 'none';
      console.log(`[DisplayManager] Hiding overlay: ${el.id}`);
    }
  }
};
