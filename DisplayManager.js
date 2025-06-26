export class DisplayManager {
  constructor({ rotateImageId = 'rotate-image', fullscreenImageId = 'fullscreen-message', onReady = () => { } } = {}) {
    this.rotateImage = document.getElementById(rotateImageId);
    this.fullscreenImage = document.getElementById(fullscreenImageId);
    this.onReady = onReady;
    this.orientationTimeout = null;
    this.bootStarted = false;

    this.updateMessage();
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('orientationchange', () => this.handleOrientationChange());
    window.addEventListener('resize', () => this.handleOrientationChange());
    document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
  }

  isPortrait() {
    return window.matchMedia('(orientation: portrait)').matches;
  }

  isFullscreen() {
    return document.fullscreenElement !== null;
  }

  updateMessage() {
    if (!this.rotateImage || !this.fullscreenImage) return;

    if (this.isPortrait()) {
      this.rotateImage.style.display = 'block';
      this.fullscreenImage.style.display = 'none';
    } else {
      this.rotateImage.style.display = 'none';

      if (!this.isFullscreen()) {
        this.fullscreenImage.style.display = 'block';
      } else if (!this.bootStarted) {
        this.fullscreenImage.style.display = 'none';
        this.bootStarted = true;
        this.onReady();
      }
    }
  }

  handleOrientationChange() {
    if (this.isPortrait() && this.isFullscreen()) {
      document.exitFullscreen().catch(err => console.warn('Exit fullscreen failed:', err));
    }

    if (this.orientationTimeout) {
      clearTimeout(this.orientationTimeout);
    }
    this.orientationTimeout = setTimeout(() => this.updateMessage(), 400);
  }

  handleFullscreenChange() {
    this.updateMessage();
  }
}
