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

    // to prevent first sound trigger
    this._menuHighlightFirstCall = true;
  }


  preload() {

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

    // // === 8. Force decode the audio ===
    // this.sound.decodeAudio('sfx_hover');
    // this.sound.decodeAudio('sfx_select');
    // this.sound.decodeAudio('sfx_text');
    // this.sound.decodeAudio('sfx_torch-up');
    // this.sound.decodeAudio('sfx_torch-down');

    // === 9. bg sounds ===

    this.playSFX('sfx_fire', 1, true);
    this.playSFX('sfx_wind', 0.1, true);
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
    if (this._menuHighlightFirstCall) {
      this._menuHighlightFirstCall = false;
    } else {
      this.playSFX('sfx_hover', 0.8);
    }
  }

  playSFX(key, volume = 1, loop = false) {
    const sound = this.sound.add(key, { volume, loop });
    sound.play();
    return sound; // optional, if you want to stop it later
  }

};