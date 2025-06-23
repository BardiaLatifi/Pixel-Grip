export class Initialization extends Phaser.Scene {
  constructor() {
    super('Initialization');
    this.orientationTimeout = null;
  }

  create() {
    this.isPortrait = window.matchMedia('(orientation: portrait)').matches;

    // Reference the DOM elements
    this.rotateImage = document.getElementById('rotate-image');
    this.fullscreenImage = document.getElementById('fullscreen-message'); // NEW DOM IMG

    this.updateMessage();

    // Monitor orientation and fullscreen changes
    window.addEventListener('orientationchange', () => this.handleOrientationChange());
    window.addEventListener('resize', () => this.handleOrientationChange());
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
  }

  updateMessage() {
    if (!this.rotateImage || !this.fullscreenImage) return;

    const isFullscreen = document.fullscreenElement !== null;

    if (this.isPortrait) {
      this.rotateImage.style.display = 'block';
      this.fullscreenImage.style.display = 'none';
    } else {
      this.rotateImage.style.display = 'none';

      if (!isFullscreen) {
        this.fullscreenImage.style.display = 'block';
      } else {
        this.fullscreenImage.style.display = 'none';
        this.scene.start('BootScene');
      }
    }
  }

  handleOrientationChange() {
    this.isPortrait = window.matchMedia('(orientation: portrait)').matches;

    if (this.isPortrait && document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.warn('Failed to exit fullscreen:', err);
      });
    }

    if (this.orientationTimeout) {
      clearTimeout(this.orientationTimeout);
    }

    this.orientationTimeout = setTimeout(() => {
      this.updateMessage();
    }, 400);
  }

  handleFullscreenChange() {
    this.updateMessage();
  }
}
