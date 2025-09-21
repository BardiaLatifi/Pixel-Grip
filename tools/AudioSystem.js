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

    // Reset sound pack to default
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

    if (childNode.id === 'mute_mode') {
      const mode = childNode.options[childNode.currentIndex];

      // Reset all flags
      scene.isMutedUI = false;
      scene.isMutedEnv = false;
      scene.isMutedAll = false;

      if (mode === 'UI') {
        scene.isMutedUI = true;
      } else if (mode === 'Environment') {
        scene.isMutedEnv = true;
      } else if (mode === 'All') {
        scene.isMutedAll = true;
      }

      // Handle existing sounds
      scene.sound.getAll().forEach(s => {
        // 🔊 Skip currentMusic here, we’ll handle separately
        if (scene.currentMusic && s.key === scene.currentMusic.key) return;

        if (mode === 'UI' && (s.key.includes('hover') || s.key.includes('select') || s.key.includes('text'))) {
          s.setMute(true);
        } else if (mode === 'Environment' && (s.key.includes('fire') || s.key.includes('wind'))) {
          s.setMute(true);
        } else if (mode === 'All') {
          s.setMute(true);
        } else {
          s.setMute(false);
        }
      });

      // 🎵 Handle music separately
      if (scene.currentMusic) {
        if (mode === 'All') {
          scene.currentMusic.setMute(true);
        } else {
          scene.currentMusic.setMute(false);

          // Auto-play if coming back from mute
          if (!scene.currentMusic.isPlaying) {
            scene.currentMusic.play();
          }
        }
      }
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
        scene.currentMusic = scene.sound.add(track, { volume: 0.1, loop: true });

        // 🔇 Respect mute-all
        if (!scene.isMutedAll) {
          scene.currentMusic.play();
        }
      } else {
        scene.currentMusic = null;
      }
    }


    rebuildMenuLabel(childNode);
  }

  // --- Refresh menu display ---
  scene.renderMenuItems();
}
