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
      console.log(`[DisplayManager] Scene → ${this.currentSceneKey}`);
    });

    // Initial evaluation
    this.evaluateDisplayState();

    // Listen for resize, orientation and fullscreen changes
    window.addEventListener('resize', () => this.evaluateDisplayState());
    window.addEventListener('orientationchange', () => this.evaluateDisplayState());
    document.addEventListener('fullscreenchange', () => this.evaluateDisplayState());
  },

  // toggle overlay and evaluate display logics for pause, resume, rotation and fullscreen.

  toggleOverlay(el, show) {
    if (!el) return;
    el.style.display = show ? 'block' : 'none';
  },

  evaluateDisplayState() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const isFullscreen = document.fullscreenElement !== null;
    const rotateVisible = isPortrait;
    const fullscreenVisible = !isPortrait && !isFullscreen;
    const shouldPause = rotateVisible || fullscreenVisible;

    // Show/hide overlays
    this.toggleOverlay(this.rotateImage, rotateVisible);
    this.toggleOverlay(this.fullscreenImage, fullscreenVisible);

    // Pause or resume game
    if (shouldPause) {
      this.pauseGame();
    } else {
      this.resumeGame();
      if (this.onReadyCallback) {
        console.log('[DisplayManager] Display ready callback triggered');
        this.onReadyCallback();
        this.onReadyCallback = null;
      }
    }

    // One-line summary
    console.log(`[DisplayManager] State → portrait=${isPortrait}, fullscreen=${isFullscreen}, rotate=${rotateVisible ? 'shown' : 'hidden'}, fullscreen-msg=${fullscreenVisible ? 'shown' : 'hidden'}, paused=${shouldPause}`);
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
