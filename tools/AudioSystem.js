import { MENU_TREE } from '../data/Menu-Tree.js';

export function AudioSystem(scene, childNode) {
  const currentNode = MENU_TREE[scene.currentNodeId];
  if (!scene.volumeSettings) {
    scene.volumeSettings = { music: 0.25, environment: 1, ui: 0.75 };
  }

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
    MENU_TREE['music'].currentIndex = 0;
    MENU_TREE['sound_pack'].currentIndex = 0;
    MENU_TREE['music_volume'].currentIndex = 1;        // 25%
    MENU_TREE['environment_volume'].currentIndex = 4;  // 100%
    MENU_TREE['ui_volume'].currentIndex = 3;           // 75%

    // Stop music
    if (scene.currentMusic) scene.currentMusic.stop();
    scene.currentMusic = null;

    // Reset sound pack to default
    const defaultPack = MENU_TREE['sound_pack'].srcs[0];
    scene.hoverSFX = defaultPack.hover;
    scene.selectSFX = defaultPack.select;
    scene.backSFX = defaultPack.back;
    scene.textSFX = defaultPack.text;

    // Reset volume settings
    scene.volumeSettings = { music: 0.25, environment: 1, ui: 0.75 };

    // Ensure volume submenu's entries show current option texts
    const volumeNode = MENU_TREE['volume'];
    if (volumeNode && Array.isArray(volumeNode.children)) {
      volumeNode.menuItems = volumeNode.children.map(childId => {
        const child = MENU_TREE[childId];
        if (!child) return childId;
        if (child.options) return `${child.label}: ${child.options[child.currentIndex]}`;
        return child.label || childId;
      });
    }

    // --- Rebuild all labels so UI text matches currentIndex ---
    currentNode.children.forEach((childId) => {
      const child = MENU_TREE[childId];
      if (child) rebuildMenuLabel(child);
    });

    // --- Apply reset volumes to already playing sounds ---
    if (scene.sound && scene.sound.sounds) {
      scene.sound.sounds.forEach(s => {
        if (s._category === 'environment') {
          const base = (typeof s._baseVolume === 'number') ? s._baseVolume : 1;
          s.setVolume(base * scene.volumeSettings.environment);
        } else if (s._category === 'ui') {
          const base = (typeof s._baseVolume === 'number') ? s._baseVolume : 1;
          s.setVolume(base * scene.volumeSettings.ui);
        } else if (s.key && s.key.includes('music')) {
          const base = (typeof s._baseVolume === 'number') ? s._baseVolume : 1;
          s.setVolume(base * scene.volumeSettings.music);
        }
      });
    }

    // ✅ NEW: Restart default music if theme or menuTree says it’s not OFF
    const musicNode = MENU_TREE['music'];
    const currentTheme = scene.customization?.themes?.[scene.customization?.currentTheme];
    const themeMusicIndex = currentTheme?.music?.currentIndex ?? null;

    const effectiveIndex = themeMusicIndex !== null ? themeMusicIndex : musicNode.currentIndex;
    const track = musicNode.options[effectiveIndex];

    if (track && track !== 'OFF') {
      scene.currentMusic = scene.sound.add(track, {
        volume: scene.volumeSettings.music,
        loop: true
      });
      scene.currentMusic.play();
    }

    // ✅ Update music label so UI matches
    rebuildMenuLabel(musicNode);
  }

  else {
    // Cycle to next option
    childNode.currentIndex = (childNode.currentIndex + 1) % childNode.options.length;

    // --- Volume handling ---
    if (childNode.id === 'music_volume') {
      const option = childNode.options[childNode.currentIndex];
      scene.volumeSettings.music = option === 'Mute' ? 0 : parseInt(option) / 100;

      if (scene.currentMusic) {
        scene.currentMusic.setVolume(scene.volumeSettings.music);
      }
    }

    if (childNode.id === 'environment_volume') {
      const option = childNode.options[childNode.currentIndex];
      scene.volumeSettings.environment = option === 'Mute' ? 0 : parseInt(option) / 100;

      // update already-playing environment sounds
      if (scene.sound && scene.sound.sounds) {
        scene.sound.sounds.forEach(s => {
          if (s._category === 'environment') {
            const base = (typeof s._baseVolume === 'number') ? s._baseVolume : 1;
            s.setVolume(base * scene.volumeSettings.environment);
          }
        });
      }
    }


    if (childNode.id === 'ui_volume') {
      const option = childNode.options[childNode.currentIndex];
      scene.volumeSettings.ui = option === 'Mute' ? 0 : parseInt(option) / 100;
    }

    // --- Sound pack ---
    if (childNode.id === 'sound_pack') {
      const pack = childNode.srcs[childNode.currentIndex];
      scene.hoverSFX = pack.hover;
      scene.selectSFX = pack.select;
      scene.backSFX = pack.back;
      scene.textSFX = pack.text;
    }

    // --- Music ---
    if (childNode.id === 'music') {
      const track = childNode.options[childNode.currentIndex];
      if (scene.currentMusic) scene.currentMusic.stop();

      if (track !== 'OFF') {
        scene.currentMusic = scene.sound.add(track, {
          volume: scene.volumeSettings.music,
          loop: true
        });
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
