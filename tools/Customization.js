// === Customization.js ===
import { MENU_TREE } from '../data/Menu-Tree.js';
import { THEMES } from '../data/Themes.js';

// ✅ Store clean copy of original MENU_TREE
const CLEAN_MENU_TREE = JSON.parse(JSON.stringify(MENU_TREE));

export const Customization = (() => {

  const themeNames = Object.keys(THEMES);
  let currentIndex = 0;
  let currentTheme = themeNames[currentIndex];

  function deepMerge(target, source) {
    for (const key in source) {
      const srcVal = source[key];
      const tgtVal = target[key];
      if (srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal)) {
        if (!tgtVal || typeof tgtVal !== 'object') target[key] = {};
        deepMerge(target[key], srcVal);
      } else {
        target[key] = srcVal;
      }
    }
    return target;
  }

  function applyTheme(themeName, scene) {

    // 1. Cleanup old theme (only when switching)
    if (scene) {
      // Stop all sounds
      if (scene.sound && scene.sound.sounds) {
        scene.sound.sounds.forEach(s => {
          s.stop();
          s.destroy();
        });
      }
      scene.currentMusic = null;

      // Destroy visual assets
      scene.environmentManager?.cleanupThemeAssets();

      // Reset MENU_TREE to clean state
      for (const key in CLEAN_MENU_TREE) {
        MENU_TREE[key] = JSON.parse(JSON.stringify(CLEAN_MENU_TREE[key]));
      }

      // ✅ Read default volume settings from reset MENU_TREE
      const musicVol = MENU_TREE['music_volume'];
      const envVol = MENU_TREE['environment_volume'];
      const uiVol = MENU_TREE['ui_volume'];

      scene.volumeSettings = {
        music: musicVol ? (musicVol.options[musicVol.currentIndex] === 'Mute' ? 0 : parseInt(musicVol.options[musicVol.currentIndex]) / 100) : 0.25,
        environment: envVol ? (envVol.options[envVol.currentIndex] === 'Mute' ? 0 : parseInt(envVol.options[envVol.currentIndex]) / 100) : 1,
        ui: uiVol ? (uiVol.options[uiVol.currentIndex] === 'Mute' ? 0 : parseInt(uiVol.options[uiVol.currentIndex]) / 100) : 0.75
      };

      console.log('[Customization] MENU_TREE reset to clean state');
    }

    // 2. Apply new theme data
    const themeData = THEMES[themeName];
    if (!themeData) {
      console.warn(`[Customization] Theme "${themeName}" not found.`);
      return;
    }

    scene.currentPaper = themeData.paper;
    scene.menuTextColor = themeData.menuTextColor;
    scene.currentTextNodeColor = themeData.textNodeColor;

    // Global properties
    const globalKeys = ['menuTextColor', 'menuFont', 'highlightColor'];
    for (const key of globalKeys) {
      if (themeData[key] !== undefined) {
        MENU_TREE[key] = themeData[key];
      }
    }

    // Merge themed nodes
    for (const nodeId in themeData) {
      const nodeTheme = themeData[nodeId];
      const menuNode = MENU_TREE[nodeId];

      if (menuNode && menuNode.useTheme) {
        deepMerge(menuNode, nodeTheme);
      }
    }

    // 3. Setup new theme audio (only when switching)
    if (scene) {
      // Reset sound pack
      const packNode = MENU_TREE['sound_pack'];
      packNode.currentIndex = 0;

      if (packNode.srcs?.[0]) {
        const pack = packNode.srcs[0];
        scene.hoverSFX = pack.hover;
        scene.selectSFX = pack.select;
        scene.backSFX = pack.back;
        scene.textSFX = pack.text;
      }

      // ✅ Rebuild sound submenu menuItems (AFTER theme merge)
      const soundNode = MENU_TREE['sound'];
      if (soundNode && Array.isArray(soundNode.children)) {
        soundNode.menuItems = soundNode.children.map(childId => {
          const child = MENU_TREE[childId];
          if (!child) return childId;
          if (child.options) return `${child.label}: ${child.options[child.currentIndex]}`;
          return child.label || childId;
        });
      }

      // ✅ Rebuild volume submenu menuItems (AFTER theme merge)
      const volumeNode = MENU_TREE['volume'];
      if (volumeNode && Array.isArray(volumeNode.children)) {
        volumeNode.menuItems = volumeNode.children.map(childId => {
          const child = MENU_TREE[childId];
          if (!child) return childId;
          if (child.options) return `${child.label}: ${child.options[child.currentIndex]}`;
          return child.label || childId;
        });
      }
      // ✅ Start new theme's default music
      const musicNode = MENU_TREE['music'];
      if (musicNode?.options?.[musicNode.currentIndex]) {
        const track = musicNode.options[musicNode.currentIndex];
        if (track !== 'OFF') {
          scene.currentMusic = scene.sound.add(track, {
            volume: scene.volumeSettings.music ?? 0.25,
            loop: true
          });
          scene.currentMusic.play();
        }
      }
    }

    // 4. Re-apply environment (only when switching)
    if (scene && scene.environmentManager) {
      let nodeToApply = MENU_TREE[scene.currentNodeId];

      // If current node is 'inherit', find parent with actual environment
      while (nodeToApply && nodeToApply.envType === 'inherit') {
        const parentId = nodeToApply.parent;
        if (!parentId) break;
        nodeToApply = MENU_TREE[parentId];
      }

      console.log(`[Customization] Re-applying environment for node: ${nodeToApply.id}`);
      scene.environmentManager.applyEnvironment(nodeToApply);

      // ✅ Also apply root's environment sounds (they're theme-wide, not node-specific)
      const rootNode = MENU_TREE['root'];
      if (rootNode.environmentSounds) {
        rootNode.environmentSounds.forEach(snd => {
          scene.playSFX(snd.key, snd.volume ?? 1, snd.loop ?? true);
        });
      }

      scene.renderMenuItems();
    }
  }

  function nextTheme() {
    currentIndex = (currentIndex + 1) % themeNames.length;
    applyTheme(themeNames[currentIndex]);
  }

  function prevTheme() {
    currentIndex = (currentIndex - 1 + themeNames.length) % themeNames.length;
    applyTheme(themeNames[currentIndex]);
  }

  function init(defaultTheme) {
    const startTheme = defaultTheme || currentTheme;
    applyTheme(startTheme);
  }

  return {
    init,
    applyTheme,
    nextTheme,
    prevTheme,
    get currentTheme() { return currentTheme; },
    get themes() { return themeNames; }
  };
})();