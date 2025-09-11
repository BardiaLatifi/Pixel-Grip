import { MENU_TREE } from '../data/Menu-Tree.js';

export function AudioSystem(scene, childNode) {
  const currentNode = MENU_TREE[scene.currentNodeId];

  // --- Helper to rebuild menuItems dynamically ---
  const rebuildMenuLabel = (child) => {
    const index = currentNode.children.indexOf(child.id);

    if (child.options) {
      // selector style label
      currentNode.menuItems[index] = `${child.label}: ${child.options[child.currentIndex]}`;
    } else {
      // plain action label
      currentNode.menuItems[index] = child.label;
    }
  };

  // --- Reset case ---
  if (childNode.id === 'reset_audio') {
    // Reset all children to default
    MENU_TREE['mute_mode'].currentIndex = 0;
    MENU_TREE['music'].currentIndex = 0;
    MENU_TREE['sound_pack'].currentIndex = 0;

    // Apply mute defaults (OFF → no mute)
    scene.sound.getAll().forEach(s => s.setMute(false));
    if (scene.currentMusic) scene.currentMusic.stop();
    scene.currentMusic = null;

    // Reset sound pack
    const defaultPack = MENU_TREE['sound_pack'].srcs[0];
    scene.hoverSFX = defaultPack.hover;
    scene.selectSFX = defaultPack.select;
    scene.textSFX = defaultPack.text;

    // Rebuild all labels
    currentNode.children.forEach((childId) => rebuildMenuLabel(MENU_TREE[childId]));

    // --- Selector case ---
  } else {
    // Cycle to next option
    childNode.currentIndex = (childNode.currentIndex + 1) % childNode.options.length;

    // Handle selector effects
    if (childNode.id === 'mute_mode') {
      const mode = childNode.options[childNode.currentIndex];
      scene.sound.getAll().forEach(s => {
        if (mode === 'UI' && (s.key.includes('sfx_hover') || s.key.includes('sfx_select') || s.key.includes('sfx_text'))) {
          s.setMute(true);
        } else if (mode === 'Environment' && (s.key.includes('sfx_fire') || s.key.includes('sfx_wind'))) {
          s.setMute(true);
        } else if (mode === 'All') {
          s.setMute(true);
        } else {
          s.setMute(false);
        }
      });
    }

    if (childNode.id === 'sound_pack') {
      const pack = childNode.srcs[childNode.currentIndex];
      scene.hoverSFX = pack.hover;
      scene.selectSFX = pack.select;
      scene.textSFX = pack.text;
    }

    if (childNode.id === 'music') {
      const track = childNode.options[childNode.currentIndex];
      if (scene.currentMusic) scene.currentMusic.stop();
      if (track !== 'OFF') {
        scene.currentMusic = scene.sound.add(track, { volume: 0.3, loop: true });
        scene.currentMusic.play();
      } else {
        scene.currentMusic = null;
      }
    }

    rebuildMenuLabel(childNode);
  }

  // --- Refresh menu display ---
  scene.renderMenuItems();
}
