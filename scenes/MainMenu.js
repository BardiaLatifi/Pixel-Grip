// scenes/MainMenuScene.js
import { MENU_TREE } from '../data/Menu-Tree.js';
import { THEMES } from '../data/Themes.js';
import { Customization } from '../tools/Customization.js';
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

    // Default volume categories
    this.volumeSettings = {
      music: 0.25,
      environment: 1,
      ui: 0.75,
    };
  }


  preload() {

  }

  create() {
    // === 1. Init Environment Manager ===
    this.environmentManager = new EnvironmentManager(this);
    this.currentNodeId = 'root';

    // ✅ Apply theme customization FIRST
    Customization.applyTheme('Mythological'); // or your default theme name


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

    // === 8. Define default Sound Pack ===
    const defaultPackNode = MENU_TREE['sound_pack'];
    defaultPackNode.currentIndex = 0;

    // 🔒 Add safety check
    if (!defaultPackNode.srcs || defaultPackNode.srcs.length === 0) {
      console.warn('No sound pack sources found. Did Customization.init() apply correctly?');
      return;
    }

    const pack = defaultPackNode.srcs[defaultPackNode.currentIndex];
    this.hoverSFX = pack.hover;
    this.selectSFX = pack.select;
    this.backSFX = pack.back;
    this.textSFX = pack.text;

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
    const itemCount = this.menuItems.length;

    // 2. Calculate vertical offset
    const baseY = 180;
    const spacing = 40;
    const offset = itemCount > 3 ? (itemCount - 3) * 25 : 0;
    const startY = baseY - offset;

    // 3. Re-create text objects
    this.menuTexts = this.menuItems.map((label, index) => {
      const globalColor = MENU_TREE.textColor;
      const isSelected = index === this.currentIndex;
      const text = this.add.text(320, startY + index * spacing, label, {
        fontFamily: 'sans-serif',
        fontSize: '24px',
        color: isSelected ? globalColor : Phaser.Display.Color.HexStringToColor(globalColor).darken(10).rgba,
      }).setOrigin(0.5);

      text.setScale(isSelected ? 1 : 0.85);
      text.setAlpha(isSelected ? 1 : 0.70);
      text.setDepth(1); // ✅ Ensure it’s above background

      return text;
    });
  }

  updateMenuHighlight() {
    this.menuTexts.forEach((text, i) => {
      const isSelected = i === this.currentIndex;

      const color = MENU_TREE.textColor;
      text.setColor(isSelected ? color : Phaser.Display.Color.HexStringToColor(color).darken(10).rgba);

      this.tweens.add({
        targets: text,
        scale: isSelected ? 1 : 0.85,
        alpha: isSelected ? 1 : 0.70,
        duration: 200,
        ease: 'Quad.easeOut',
      });
    });
    if (this._menuHighlightFirstCall) {
      this._menuHighlightFirstCall = false;
    } else {
      this.playSFX(this.hoverSFX, 0.8);
    }
  }

  playSFX(key, volume = 1, loop = false) {
    // Decide category volume
    let categoryVolume = 1;

    if (key.includes('hover') || key.includes('select') || key.includes('back') || key.includes('text')) {
      categoryVolume = this.volumeSettings?.ui ?? 1;
    } else if (key.includes('fire') || key.includes('wind')) {
      categoryVolume = this.volumeSettings?.environment ?? 1;
    } else {
      categoryVolume = this.volumeSettings?.ui ?? 1; // fallback
    }

    // Final volume
    const finalVolume = volume * categoryVolume;
    if (finalVolume <= 0) return null;

    const sound = this.sound.add(key, { volume: finalVolume, loop });

    // remember base volume & category so we can update later
    sound._baseVolume = volume;
    sound._category = (key.includes('fire') || key.includes('wind'))
      ? 'environment'
      : (key.includes('hover') || key.includes('select') || key.includes('back') || key.includes('text'))
        ? 'ui'
        : 'other';

    sound.play();
    return sound;
  }

};