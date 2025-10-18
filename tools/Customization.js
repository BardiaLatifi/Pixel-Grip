// === Customization.js ===
import { MENU_TREE } from '../data/Menu-Tree.js';
import { THEMES } from '../data/Themes.js';

export const Customization = (() => {

  // --- Internal state ---
  const themeNames = Object.keys(THEMES);
  let currentIndex = 0;
  let currentTheme = themeNames[currentIndex];

  // --- Utility: Deep merge to avoid data loss ---
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

  // --- Apply the given theme to the menu tree ---
  function applyTheme(themeName) {
    const themeData = THEMES[themeName];
    if (!themeData) {
      console.warn(`[Customization] Theme "${themeName}" not found.`);
      return;
    }

    // ✅ Apply global theme properties (like textColor)
    const globalKeys = ['textColor', 'menuFont', 'highlightColor'];
    for (const key of globalKeys) {
      if (themeData[key] !== undefined) {
        MENU_TREE[key] = themeData[key];
      }
    }

    // ✅ Merge each themed node into the menu tree
    for (const nodeId in themeData) {
      const nodeTheme = themeData[nodeId];
      const menuNode = MENU_TREE[nodeId];

      if (menuNode && menuNode.useTheme) {
        deepMerge(menuNode, nodeTheme);
      }
    }
  }

  // --- Cycle controls ---
  function nextTheme() {
    currentIndex = (currentIndex + 1) % themeNames.length;
    applyTheme(themeNames[currentIndex]);
  }

  function prevTheme() {
    currentIndex = (currentIndex - 1 + themeNames.length) % themeNames.length;
    applyTheme(themeNames[currentIndex]);
  }

  // --- Init ---
  function init(defaultTheme) {
    const startTheme = defaultTheme || currentTheme;
    applyTheme(startTheme);
  }

  // --- Public API ---
  return {
    init,
    applyTheme,
    nextTheme,
    prevTheme,
    get currentTheme() { return currentTheme; },
    get themes() { return themeNames; }
  };
})();
