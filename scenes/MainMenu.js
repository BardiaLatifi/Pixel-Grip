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
    this.load.spritesheet('background', 'assets/main-menu/background-sheet.png', {
      frameWidth: 640,
      frameHeight: 360
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

    // Root Background
    this.anims.create({
      key: 'bg-loop',
      frames: this.anims.generateFrameNumbers('background', { start: 0, end: 24 }),
      frameRate: 5,
      repeat: -1
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

    this.bg = this.add.sprite(320, 180, 'background').play('bg-loop');

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


  playBackground(key, onComplete) {
    if (this.bg) {
      this.bg.stop();      // ✅ Stop any previous animation
      this.bg.destroy();   // ✅ Destroy old bg safely
    }

    this.bg = this.add.sprite(320, 180, key).setDepth(0).play(key);

    if (onComplete) {
      this.bg.once('animationcomplete', onComplete);
    }
  }


  enterSubMenu(label) {
    if (this.menuTree[label]) {
      this.clearMenuTexts(); // ✅ Clear old menu texts first

      this.currentMenu = label;
      this.menuItems = this.menuTree[label];
      this.currentIndex = 0;

      if (label === 'Options') {
        // 🛠 Delay menu render until animation finishes
        this.playBackground('options-enter', () => {
          this.playBackground('options-loop');
          this.renderMenuItems();      // ✅ Now it's safe to render
          this.updateMenuHighlight();
        });
      } else {
        this.renderMenuItems();
        this.updateMenuHighlight();
      }
    } else {
      if (label === 'Play') this.scene.start('YourGameScene');
    }
  }



  exitSubMenu() {
    if (this.currentMenu === 'Options') {
      this.playBackground('options-exit', () => {
        this.playBackground('bg-loop'); // Default background
      });
    } else {
      this.playBackground('bg-loop');
    }

    this.currentMenu = 'root';
    this.menuItems = this.menuTree[this.currentMenu];
    this.currentIndex = 0;
    this.clearMenuTexts();
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
