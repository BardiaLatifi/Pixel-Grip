// scenes/MainMenuScene.js
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
    this.menuItems = ['Start Game', 'Options', 'Credits'];
    this.currentIndex = 0;
  }

  preload() {
  }

  create() {

    // Fade in from black
    this.cameras.main.fadeIn(2000, 0, 0, 0);

    this.input.enabled = false;
    this.cameras.main.once('camerafadeincomplete', () => {
      this.input.enabled = true;
    });

    // 1. Background animation
    this.anims.create({
      key: 'bg-loop',
      frames: this.anims.generateFrameNumbers('background', { start: 0, end: 24 }),
      frameRate: 5,
      repeat: -1
    });

    console.log('[MainMenuScene] Total frames in background:', this.textures.get('background').frameTotal);


    this.bg = this.add.sprite(320, 180, 'background').play('bg-loop');

    // 2. Menu text items
    this.menuTexts = this.menuItems.map((label, index) => {
      return this.add.text(320, 180 + index * 40, label, {
        fontFamily: 'sans-serif',
        fontSize: '24px',
        color: index === this.currentIndex ? '#fff' : '#999'
      }).setOrigin(0.5);
    });

    // 3. Setup direction buttons
    this.setupInputHandlers();

    // 4. Show the directional buttons and hide nipple.js
    document.getElementById('direction-btn-container').style.display = 'flex';
    document.getElementById('joystick-container').style.display = 'none';
  }

  updateMenuHighlight() {
    this.menuTexts.forEach((text, i) => {
      text.setColor(i === this.currentIndex ? '#fff' : '#999');
    });
  }

  setupInputHandlers() {
    // HTML buttons
    document.getElementById('btn-up').addEventListener('click', () => {
      this.currentIndex = (this.currentIndex - 1 + this.menuItems.length) % this.menuItems.length;
      this.updateMenuHighlight();
    });

    document.getElementById('btn-down').addEventListener('click', () => {
      this.currentIndex = (this.currentIndex + 1) % this.menuItems.length;
      this.updateMenuHighlight();
    });

    document.getElementById('option-btn').addEventListener('click', () => {
      const selected = this.menuItems[this.currentIndex];
      console.log(`Selected: ${selected}`);
      if (selected === 'Start Game') {
        this.scene.start('YourGameScene'); // Replace with actual game scene
      }
    });
  }

  shutdown() {
    // Hide direction buttons & re-enable joystick
    document.getElementById('direction-btn-container').style.display = 'none';
    document.getElementById('joystick-container').style.display = 'block';
  }
}
