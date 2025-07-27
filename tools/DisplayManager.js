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

    // Track current scene (works even without transitions)
    game.events.on('start', (scene) => {
      this.currentSceneKey = scene.scene.key;
      console.log(`[DisplayManager] Scene → ${this.currentSceneKey}`);
    });

    // Initial evaluation
    this.evaluateDisplayState();

    // Listen to display-related changes
    window.addEventListener('resize', () => this.evaluateDisplayState());
    window.addEventListener('orientationchange', () => this.evaluateDisplayState());
    document.addEventListener('fullscreenchange', () => this.evaluateDisplayState());
  },

  evaluateDisplayState() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    const isFullscreen = document.fullscreenElement !== null;

    const rotateVisible = isPortrait;
    const fullscreenVisible = !isPortrait && !isFullscreen;

    // Show/hide overlays
    this.toggleOverlay(this.rotateImage, rotateVisible);
    this.toggleOverlay(this.fullscreenImage, fullscreenVisible);

    // Ready trigger (only when display is in good state)
    if (!rotateVisible && !fullscreenVisible && this.onReadyCallback) {
      this.onReadyCallback();
      this.onReadyCallback = null;
    }
  },

  toggleOverlay(el, show) {
    if (!el) return;
    el.style.display = show ? 'block' : 'none';
  }

  // Future: Add pauseGame/resumeGame when you build GameScene
};
