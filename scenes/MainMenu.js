// scenes/MainMenuScene.js
import { MENU_TREE } from '../data/Menu-Tree.js';
import EnvironmentManager from '../EnvironmentManager.js';


export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');

    // Core state
    this.currentNodeId = 'root'; // Refers to MENU_TREE key
    this.menuTree = MENU_TREE;

    // UI state
    this.menuItems = this.menuTree[this.currentNodeId].menuItems;
    this.currentIndex = 0;

    // Managers
    this.environmentManager = null;

    // UI Elements
    this.textElements = [];
  }


  preload() {
    // ***** THIS ASSETS LOAD IS FOR DEBUG SCENE AND MUST DELETE AFTER DEBUGGING

    // *** Root Assets ***
    this.load.image('background-root', 'assets/main-menu/bg-root.png');

    this.load.spritesheet('fire-root', 'assets/main-menu/fire-root.png', {
      frameWidth: 120,
      frameHeight: 80
    });

    // *** Options Assets ***
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

    // *** About Assets ***
    this.load.image('background-about', 'assets/main-menu/bg-about.png');

    this.load.spritesheet('fire-about', 'assets/main-menu/fire-about.png', {
      frameWidth: 208,
      frameHeight: 144
    });

    // the Paper
    this.load.image('paper-static', 'assets/main-menu/paper-static.png');

    this.load.spritesheet('paper-expand', 'assets/main-menu/paper-expand.png', {
      frameWidth: 480,
      frameHeight: 270
    });

    this.load.spritesheet('paper-collapse', 'assets/main-menu/paper-collapse.png', {
      frameWidth: 480,
      frameHeight: 270
    });

    // Optionally load a click sound or menu move sound here
  }

  create() {
    // === 1. Init Environment Manager ===
    this.environmentManager = new EnvironmentManager(this);
    this.currentNodeId = 'root';
    this.environmentManager.applyEnvironment(MENU_TREE[this.currentNodeId]);


    // === 2. Init Menu State ===
    this.menuTree = MENU_TREE;
    this.currentNode = this.menuTree.root;
    this.currentIndex = 0;

    // === 3. DOM Button Setup ===
    this.upButton = document.getElementById('btn-up');
    this.downButton = document.getElementById('btn-down');
    this.leftButton = document.getElementById('btn-left');
    this.rightButton = document.getElementById('btn-right');
    this.button1 = document.getElementById('button1');
    this.button2 = document.getElementById('button2');
    this.button3 = document.getElementById('button3');
    this.iTag = document.querySelector('#button1 i');

    // === 4. UI Mode: Show D-Pad, Hide Joystick ===
    document.getElementById('direction-btn-container').style.display = 'flex';
    document.getElementById('joystick-container').style.display = 'none';

    // === 5. Customize Right-Side Buttons ===
    this.button1.innerHTML = '<i class="fa-regular fa-circle"></i>';
    this.button2.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    this.button1.querySelector('i').style.setProperty('font-size', '1.5rem', 'important');
    this.button2.querySelector('i').style.setProperty('font-size', '2rem', 'important');
    this.button3.style.display = 'none';

    // === 6. Render Menu Items ===
    this.renderMenuItems();
    this.updateMenuHighlight();

    // === 7. Setup Input Listeners ===
    this.setupInputHandlers();

    this.cameras.main.fadeIn(800, 0, 0, 0);
  }

  setupInputHandlers() {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const button1 = document.getElementById('button1');
    const button2 = document.getElementById('button2');

    let holdTimer = null;
    let repeatInterval = null;

    const startHold = (directionFn) => {
      directionFn(); // Trigger once immediately
      holdTimer = setTimeout(() => {
        repeatInterval = setInterval(directionFn, 220);
      }, 400);
    };

    const stopHold = () => {
      clearTimeout(holdTimer);
      clearInterval(repeatInterval);
    };

    const moveUp = () => {
      this.currentIndex = (this.currentIndex - 1 + this.menuItems.length) % this.menuItems.length;
      this.updateMenuHighlight();
    };

    const moveDown = () => {
      this.currentIndex = (this.currentIndex + 1) % this.menuItems.length;
      this.updateMenuHighlight();
    };

    btnUp.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startHold(moveUp);
    }, { passive: false });

    btnDown.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startHold(moveDown);
    }, { passive: false });

    ['touchend', 'touchcancel'].forEach(evt => {
      btnUp.addEventListener(evt, stopHold);
      btnDown.addEventListener(evt, stopHold);
    });

    // --- Tap with visual feedback ---
    const buttonFeedback = (el, callback) => {
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        el.classList.add('active');
        callback();
      }, { passive: false });

      ['touchend', 'touchcancel'].forEach(evt => {
        el.addEventListener(evt, () => el.classList.remove('active'));
      });
    };

    // button1 = Select / Enter submenu
    buttonFeedback(button1, () => {
      const node = MENU_TREE[this.currentNodeId];
      const childId = node.children[this.currentIndex];
      if (childId) {
        this.environmentManager.goTo(childId);
        this.currentNodeId = childId;
        this.currentIndex = 0;
        this.renderMenuItems();
      } else {
        console.log(`Selected action: ${node.menuItems[this.currentIndex]}`);
      }
    });

    // button2 = Go Back
    buttonFeedback(button2, () => {
      const parentId = MENU_TREE[this.currentNodeId].parent;
      if (parentId) {
        this.environmentManager.goTo(parentId);
        this.currentNodeId = parentId;
        this.currentIndex = 0;
        this.renderMenuItems();
      }
    });
  }

  clearMenuTexts() {
    if (this.menuTexts) {
      this.menuTexts.forEach(text => text.destroy());
    }
    this.menuTexts = [];
  }

  renderMenuItems() {
    // 0. Destroy any existing text objects
    this.clearMenuTexts();

    // 1. Re-fetch the menu labels
    this.menuItems = MENU_TREE[this.currentNodeId].menuItems;

    // 2. Re-create text objects
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
}
