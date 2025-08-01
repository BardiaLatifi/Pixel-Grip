import { MENU_TREE } from '../data/Menu-Tree.js';


export function inputHandlers(scene) {
  const sceneKey = scene.scene.key;

  // DOM Button Setup
  const upButton = document.getElementById('btn-up');
  const downButton = document.getElementById('btn-down');
  const leftButton = document.getElementById('btn-left');
  const rightButton = document.getElementById('btn-right');
  const button1 = document.getElementById('button1');
  const button2 = document.getElementById('button2');
  const button3 = document.getElementById('button3');
  const iTag = document.querySelector('#button1 i');

  let holdTimer = null;
  let repeatInterval = null;

  const startHold = (directionFn) => {
    directionFn();
    holdTimer = setTimeout(() => {
      repeatInterval = setInterval(directionFn, 220);
    }, 400);
  };

  const stopHold = () => {
    clearTimeout(holdTimer);
    clearInterval(repeatInterval);
  };

  const moveUp = () => {
    scene.currentIndex = (scene.currentIndex - 1 + scene.menuItems.length) % scene.menuItems.length;
    scene.updateMenuHighlight();
  };

  const moveDown = () => {
    scene.currentIndex = (scene.currentIndex + 1) % scene.menuItems.length;
    scene.updateMenuHighlight();
  };

  upButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startHold(moveUp);
  }, { passive: false });

  downButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startHold(moveDown);
  }, { passive: false });

  ['touchend', 'touchcancel'].forEach(evt => {
    upButton.addEventListener(evt, stopHold);
    downButton.addEventListener(evt, stopHold);
  });

  // Utility to handle action button with touch feedback and callback
  const actionButton = (el, callback) => {
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      el.classList.add('active');
      callback();
    }, { passive: false });

    ['touchend', 'touchcancel'].forEach(evt => {
      el.addEventListener(evt, () => el.classList.remove('active'));
    });
  };

  // button1 = Enter submenu or run action
  actionButton(button1, () => {
    if (scene.environmentManager.isTransitioning) return;
    const currentNode = MENU_TREE[scene.currentNodeId];
    const selectedChildId = currentNode.children?.[scene.currentIndex];

    if (selectedChildId) {
      scene.environmentManager.goTo(selectedChildId);
      scene.currentNodeId = selectedChildId;
      scene.currentIndex = 0;
      scene.renderMenuItems();
    } else {
      console.log(`Selected action: ${currentNode.menuItems[scene.currentIndex]}`);
    }
  });

  // button2 = Go Back to parent
  actionButton(button2, () => {
    if (scene.environmentManager.isTransitioning) return;
    const currentNode = MENU_TREE[scene.currentNodeId];
    const parentId = currentNode.parent;

    if (parentId) {
      scene.environmentManager.goTo(parentId);
      scene.currentNodeId = parentId;
      scene.currentIndex = 0;
      scene.renderMenuItems();
    } else {
      console.log('Already at root node.');
    }
  });



  // Flags
  if (sceneKey === 'MainMenuScene') {
    // 1. UI Mode: Show D-Pad, Hide Joystick
    document.getElementById('direction-btn-container').style.display = 'flex';
    document.getElementById('joystick-container').style.display = 'none';

    // 2. Customize Right-Side Buttons
    button1.innerHTML = '<i class="fa-regular fa-circle"></i>';
    button2.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    button1.querySelector('i').style.setProperty('font-size', '1.5rem', 'important');
    button2.querySelector('i').style.setProperty('font-size', '2rem', 'important');
    button3.style.display = 'none';
  }
}
