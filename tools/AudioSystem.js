import { MENU_TREE } from '../data/Menu-Tree.js';

export function AudioSystem(scene, childNode) {
  const currentNode = MENU_TREE[scene.currentNodeId];

  // --- Helper to rebuild menuItems dynamically ---
  const rebuildMenuLabel = (child) => {
    const index = currentNode.children.indexOf(child.id);
    if (child.action === 'toggle') {
      currentNode.menuItems[index] = `${child.label}: ${child.value ? 'ON' : 'OFF'}`;
    } else if (child.action === 'selector') {
      currentNode.menuItems[index] = `${child.label}: ${child.options[child.currentIndex]}`;
    } else if (child.action === 'action') {
      currentNode.menuItems[index] = child.label;
    }
  };

  // --- Perform action based on childNode.action ---
  switch (childNode.action) {
    case 'toggle':
      childNode.value = !childNode.value;

      // Directly handle audio muting
      if (childNode.id === 'mute_ui') {
        // Mute/unmute all UI SFX
        scene.sound.getAll().forEach(s => {
          if (s.key.includes('sfx_hover') || s.key.includes('sfx_select') || s.key.includes('sfx_text')) {
            s.setMute(childNode.value);
          }
        });
      }
      if (childNode.id === 'mute_env') {
        // Mute/unmute environment SFX
        scene.sound.getAll().forEach(s => {
          if (s.key.includes('sfx_fire') || s.key.includes('sfx_wind')) {
            s.setMute(childNode.value);
          }
        });
      }

      rebuildMenuLabel(childNode);
      break;

    case 'selector':
      childNode.currentIndex = (childNode.currentIndex + 1) % childNode.options.length;

      if (childNode.id === 'sound_pack') {
        // Switch SFX sources for the selected sound pack
        const pack = childNode.srcs[childNode.currentIndex];
        scene.hoverSFX = pack.hover;
        scene.selectSFX = pack.select;
        scene.textSFX = pack.text;
      }

      if (childNode.id === 'music') {
        const track = childNode.options[childNode.currentIndex];
        // Stop previous music
        if (scene.currentMusic) scene.currentMusic.stop();
        // Play new track if not OFF
        if (track !== 'OFF') {
          scene.currentMusic = scene.sound.add(track, { volume: 0.3, loop: true });
          scene.currentMusic.play();
        } else {
          scene.currentMusic = null;
        }
      }

      rebuildMenuLabel(childNode);
      break;

    case 'action':
      if (childNode.id === 'reset_audio') {
        // Reset all children to default values
        MENU_TREE['mute_ui'].value = false;
        MENU_TREE['mute_env'].value = false;
        MENU_TREE['music'].currentIndex = 0;
        MENU_TREE['sound_pack'].currentIndex = 0;

        // Apply changes directly
        scene.sound.getAll().forEach(s => s.setMute(false));
        if (scene.currentMusic) scene.currentMusic.stop();
        scene.currentMusic = null;

        // Reset sound pack SFX
        const defaultPack = MENU_TREE['sound_pack'].srcs[0];
        scene.hoverSFX = defaultPack.hover;
        scene.selectSFX = defaultPack.select;
        scene.textSFX = defaultPack.text;

        // Rebuild all labels
        currentNode.children.forEach((childId) => rebuildMenuLabel(MENU_TREE[childId]));
      }
      break;
  }

  // --- Refresh menu display ---
  scene.renderMenuItems();
}
