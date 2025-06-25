export class Initialization extends Phaser.Scene {
  constructor() {
    super('Initialization');
    this.orientationTimeout = null;
    this.bootStarted = false; // Flag to ensure BootScene starts only once
  }

  preload() {
    // Preload the Phaser logo for use in BootScene
    this.load.image('phaser-logo', 'assets/boot/phaser-logo.png');
    this.load.image('pixelgrip-logo', 'assets/boot/pixel-grip-logo.png');
    this.load.image('slogan', 'assets/boot/slogan.png');
    this.load.image('press-option', 'assets/boot/press-option.png');
  }

  create() {
    // Determine initial orientation state
    this.isPortrait = window.matchMedia('(orientation: portrait)').matches;

    // Reference the DOM elements for rotation & fullscreen messages
    this.rotateImage = document.getElementById('rotate-image');
    this.fullscreenImage = document.getElementById('fullscreen-message');

    // Update UI based on current orientation/fullscreen state
    this.updateMessage();

    // Listen for orientation changes (rotate phone) and window resizes
    window.addEventListener('orientationchange', () => this.handleOrientationChange());
    window.addEventListener('resize', () => this.handleOrientationChange());

    // Listen for fullscreen enter/exit events
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
  }

  updateMessage() {
    // Guard: ensure DOM elements are available
    if (!this.rotateImage || !this.fullscreenImage) {
      return;
    }

    const isFullscreen = document.fullscreenElement !== null;

    if (this.isPortrait) {
      // In portrait mode: show rotate prompt, hide fullscreen prompt
      this.rotateImage.style.display = 'block';
      this.fullscreenImage.style.display = 'none';

    } else {
      // In landscape mode: hide rotate prompt
      this.rotateImage.style.display = 'none';

      if (!isFullscreen) {
        // If not fullscreen: show prompt to hold fullscreen button
        this.fullscreenImage.style.display = 'block';

      } else if (!this.bootStarted) {
        // If fullscreen AND BootScene hasn't started yet
        this.fullscreenImage.style.display = 'none';
        this.bootStarted = true; // Prevent re-entering
        this.scene.start('BootScene');
      }
    }
  }

  handleOrientationChange() {
    // Update orientation state
    this.isPortrait = window.matchMedia('(orientation: portrait)').matches;

    // If rotated back to portrait while fullscreen active, exit fullscreen
    if (this.isPortrait && document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.warn('Failed to exit fullscreen:', err);
      });
    }

    // Debounce UI updates to avoid rapid firing during rotation
    if (this.orientationTimeout) {
      clearTimeout(this.orientationTimeout);
    }
    this.orientationTimeout = setTimeout(() => {
      this.updateMessage();
    }, 400);
  }

  handleFullscreenChange() {
    // Update UI when fullscreen state changes
    this.updateMessage();
  }
}
