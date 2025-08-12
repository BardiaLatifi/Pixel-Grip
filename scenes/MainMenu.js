// scenes/MainMenuScene.js
import { MENU_TREE } from '../data/Menu-Tree.js';
import EnvironmentManager from '../tools/EnvironmentManager.js';
import { inputHandlers } from '../tools/InputHandlers.js';


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

    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

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

    inputHandlers(this);

    // === 6. Render Menu Items ===
    this.renderMenuItems();
    this.updateMenuHighlight();

    // === 7. Setup Input Listeners ===

    this.cameras.main.fadeIn(800, 0, 0, 0);
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
};