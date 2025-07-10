// scenes/MainMenuScene.js
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
    this.menuTree = {
      root: ['Play', 'Options', 'About'],
      Options: ['Audio', 'Controls', 'Themes'],
      About: ['Project Info', 'Credits']
    };
    this.currentMenu = 'root';     // current menu level
    this.menuItems = this.menuTree[this.currentMenu]; // displayed items
    this.currentIndex = 0;
  }


  preload() {
    // ***** THIS ASSETS LOAD IS FOR DEBUG SCENE AND MUST DELETE AFTER DEBUGGING
    this.load.image('background', 'assets/main-menu/bg-root.png');

    this.load.spritesheet('fire', 'assets/main-menu/fire.png', {
      frameWidth: 120,
      frameHeight: 80
    });

    this.load.spritesheet('options-enter', 'assets/main-menu/options-enter.png', {
      frameWidth: 640,
      frameHeight: 360
    });
    this.load.spritesheet('options-loop', 'assets/main-menu/options-loop.png', {
      frameWidth: 640,
      frameHeight: 360
    });
    this.load.spritesheet('options-exit', 'assets/main-menu/options-exit.png', {
      frameWidth: 640,
      frameHeight: 360
    });

    // Optionally load a click sound or menu move sound here
  }

  create() {
    this.inSubMenu = false;

    // Fade in from black
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    this.input.enabled = false;

    this.renderMenuItems();       // Draw initial menu

    this.cameras.main.once('camerafadeincomplete', () => {
      this.input.enabled = true;
    });

    // 1. Animations

    // Static Backgrounds and moving parts
    this.createBackground('background');
    this.createMovingPart('fire', 206, 168, {
      frameRate: 10,
      start: 0,
      end: 23,
      loop: true
    });
    // Options Entering
    this.anims.create({
      key: 'options-enter',
      frames: this.anims.generateFrameNumbers('options-enter', { start: 0, end: 10 }),
      frameRate: 22,
      repeat: 0
    });

    // Options Background
    this.anims.create({
      key: 'options-loop',
      frames: this.anims.generateFrameNumbers('options-loop', { start: 0, end: 10 }),
      frameRate: 18,
      repeat: -1
    });

    // Options Exit
    this.anims.create({
      key: 'options-exit',
      frames: this.anims.generateFrameNumbers('options-exit', { start: 0, end: 9 }),
      frameRate: 28,
      repeat: 0
    });

    // 2. Setup direction buttons
    this.setupInputHandlers();

    // 3. Show the directional buttons and hide nipple.js
    document.getElementById('direction-btn-container').style.display = 'flex';
    document.getElementById('joystick-container').style.display = 'none';

    // 4. Customize Right Side UI
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');
    const button3 = document.getElementById('button3');

    // Set icons
    button1.innerHTML = '<i class="fa-regular fa-circle"></i>';
    button2.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    // Set style
    button1.querySelector('i').style.setProperty('font-size', '1.5rem', 'important');
    button2.querySelector('i').style.setProperty('font-size', '2rem', 'important');


    // Hide third button
    button3.style.display = 'none';

    console.log('[Menu Changed] Current menu:', this.currentMenu, 'Items:', this.menuItems);

  }

  setupInputHandlers() {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');

    // --- Holding logic for UP/DOWN buttons ---
    let holdTimer = null;
    let repeatInterval = null;

    const startHold = (directionFn) => {
      directionFn(); // trigger immediately
      holdTimer = setTimeout(() => {
        repeatInterval = setInterval(directionFn, 220);
      }, 400); // start repeating after 400ms
    };

    const stopHold = () => {
      clearTimeout(holdTimer);
      clearInterval(repeatInterval);
    };

    btnUp.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startHold(() => {
        this.currentIndex = (this.currentIndex - 1 + this.menuItems.length) % this.menuItems.length;
        this.updateMenuHighlight();
      });
    }, { passive: false });

    btnDown.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startHold(() => {
        this.currentIndex = (this.currentIndex + 1) % this.menuItems.length;
        this.updateMenuHighlight();
      });
    }, { passive: false });

    ['touchend', 'touchcancel'].forEach(event => {
      btnUp.addEventListener(event, stopHold);
      btnDown.addEventListener(event, stopHold);
    });

    // --- Tap logic with visual feedback for button1 ---
    const setupButtonWithActiveFeedback = (buttonEl, callback) => {
      buttonEl.addEventListener('touchstart', (e) => {
        e.preventDefault();
        buttonEl.classList.add('active');
        callback();
      }, { passive: false });

      ['touchend', 'touchcancel'].forEach(event => {
        buttonEl.addEventListener(event, () => {
          buttonEl.classList.remove('active');
        });
      });
    };

    // Select (button1)
    setupButtonWithActiveFeedback(button1, () => {
      const selected = this.menuItems[this.currentIndex];
      this.enterSubMenu(selected);
    });

    // Back (button2)
    setupButtonWithActiveFeedback(button2, () => {
      if (this.currentMenu !== 'root') {
        this.exitSubMenu();
      }
    });
  }


  clearMenuTexts() {
    this.menuTexts.forEach(text => text.destroy());
    this.menuTexts = [];
  }


  renderMenuItems() {
    this.menuTexts = this.menuItems.map((label, index) => {
      const isSelected = index === this.currentIndex;
      const text = this.add.text(320, 180 + index * 40, label, {
        fontFamily: 'sans-serif',
        fontSize: '24px',
        color: isSelected ? '#fff' : '#999',
      }).setOrigin(0.5);

      text.setScale(isSelected ? 1 : 0.85);
      text.setAlpha(isSelected ? 1 : 0.75);
      text.setDepth(1); // ✅ Put on top of background!

      return text;
    });
  }

  // Creating the Environments of the Menus
  createBackground(key, onComplete = null) {
    if (this.bg) {
      this.bg.stop?.();      // stop if it's an animation
      this.bg.destroy();     // clean up previous bg
    }

    // If an animation exists, it's a sprite animation
    if (this.anims.exists(key)) {
      this.bg = this.add.sprite(320, 180, key).setDepth(0).play(key);

      if (onComplete) {
        this.bg.once('animationcomplete', onComplete);
      }
    } else {
      // Static background image
      this.bg = this.add.image(0, 0, key).setOrigin(0).setDepth(0);
      if (onComplete) onComplete(); // trigger callback immediately for consistency
    }
  }

  createMovingPart(key, x, y, config = {}) {
    if (this.movingPart) {
      this.movingPart.destroy();
      this.movingPart = null;
    }
    if (this.movingPart) {
      this.movingPart.destroy();
    }

    if (!key) return; // Prevent error when key is null

    const {
      start = 0,
      end = null,
      frameRate = 10,
      loop = true,
      originX = 0.5,
      originY = 0.5
    } = config;

    const animKey = `${key}-loop`;

    // Only create animation if it doesn't already exist
    if (!this.anims.exists(animKey)) {
      this.anims.create({
        key: animKey,
        frames: this.anims.generateFrameNumbers(key, {
          start,
          end: end !== null ? end : this.textures.get(key).frameTotal - 1
        }),
        frameRate,
        repeat: loop ? -1 : 0
      });
    }

    this.movingPart = this.add.sprite(x, y, key)
      .setOrigin(originX, originY)
      .setDepth(1)
      .play(animKey);
  }

  // the logics of Toggle Submenus
  enterSubMenu(label) {
    if (this.menuTree[label]) {
      this.clearMenuTexts();

      this.currentMenu = label;
      this.menuItems = this.menuTree[label];
      this.currentIndex = 0;

      if (label === 'Options') {
        // the root moving part destroys when user enters to options submenu
        this.createMovingPart(null);
        // Play animated transition → then loop background and show menu
        this.createBackground('options-enter', () => {
          this.createBackground('options-loop');
          this.renderMenuItems();
          this.updateMenuHighlight();
        });
      } else {
        // Static submenu (e.g., About)
        this.createBackground('background'); // fallback bg
        this.createMovingPart('fire', 206, 168, {
          start: 0,
          end: 23,
          frameRate: 10,
          loop: true
        });
        this.renderMenuItems();
        this.updateMenuHighlight();
      }
    } else {
      // Handle top-level actions
      if (label === 'Play') {
        this.scene.start('YourGameScene');
      }
    }
  }

  exitSubMenu() {
    this.clearMenuTexts();

    if (this.currentMenu === 'Options') {
      // Play exit animation, then restore static root bg + fire
      this.createBackground('options-exit', () => {
        this.createBackground('background');
        this.createMovingPart('fire', 206, 168, {
          start: 0,
          end: 23,
          frameRate: 10,
          loop: true
        });
        this.showRootMenu();
      });
    } else {
      // No animation needed, just go back
      this.createBackground('background');
      this.createMovingPart('fire', 206, 168, {
        start: 0,
        end: 23,
        frameRate: 10,
        loop: true
      });
      this.showRootMenu();
    }
  }

  showRootMenu() {
    this.currentMenu = 'root';
    this.menuItems = this.menuTree[this.currentMenu];
    this.currentIndex = 0;
    this.renderMenuItems();
    this.updateMenuHighlight();
  }

  updateMenuHighlight() {
    this.menuTexts.forEach((text, i) => {
      const isSelected = i === this.currentIndex;

      text.setColor(isSelected ? '#fff' : '#999');

      this.tweens.add({
        targets: text,
        scale: isSelected ? 1 : 0.85,
        alpha: isSelected ? 1 : 0.75,
        duration: 200,
        ease: 'Quad.easeOut',
      });
    });
  }

  shutdown() {
    // Hide direction buttons & re-enable joystick
    document.getElementById('direction-btn-container').style.display = 'none';
    document.getElementById('joystick-container').style.display = 'block';
  }
}
