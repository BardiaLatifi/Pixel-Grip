export const MENU_TREE = {
  root: {
    id: 'root',
    type: 'menu',
    envType: 'split',
    background: 'background-root',
    movingPart: {
      key: 'fire-root',
      anim: 'fire-root', // ✅ You were missing this
      x: 206,
      y: 168,
      config: { start: 0, end: 23, frameRate: 10, loop: true }
    },
    children: ['play', 'options', 'about'],
    menuItems: ['Play', 'Options', 'About']
  },

  play: {
    id: 'play',
    type: 'action',
    parent: 'root',
    background: 'background-play',
    menuItems: [],
    children: []
  },

  options: {
    id: 'options',
    type: 'menu',
    envType: 'solid',
    parent: 'root',
    background: 'options-loop',
    animation: {
      start: 0,
      end: 10,
      frameRate: 18,
      loop: true,
      x: 320,
      y: 180
    },
    enterAnimation: 'options-enter',
    exitAnimation: 'options-exit',
    transitionConfig: {
      frameRate: 25,
      start: 0,
      end: 9
    },
    useSpriteAnimation: true,
    children: ['audio', 'controls', 'themes'],
    menuItems: ['Audio', 'Controls', 'Themes']
  },

  audio: {
    id: 'audio',
    type: 'menu',
    envType: 'inherit',
    parent: 'options',
    background: 'background-audio',
    menuItems: [],
    children: []
  },

  controls: {
    id: 'controls',
    type: 'menu',
    envType: 'inherit',
    parent: 'options',
    background: 'background-controls',
    menuItems: [],
    children: []
  },

  themes: {
    id: 'themes',
    type: 'menu',
    envType: 'inherit',
    parent: 'options',
    background: 'background-themes',
    menuItems: [],
    children: []
  },

  about: {
    id: 'about',
    type: 'menu',
    envType: 'split',
    parent: 'root',
    background: 'background-about',
    movingPart: {
      key: 'fire-about',
      x: 424,
      y: 166,
      config: { start: 0, end: 23, frameRate: 10, loop: true }
    },
    children: ['project-info', 'grip-guide'],
    menuItems: ['Project Info', 'Grip Guide']
  },

  // why these two are like that?! why they are strings as key?
  'project-info': {
    id: 'project-info',
    type: 'menu',
    envType: 'text',
    parent: 'about',
    textSequence: [
      "Welcome to the project info.",
      "This project is created with Phaser and JS.",
      "Enjoy navigating through the menus!"
    ],
  },

  'grip-guide': {
    id: 'grip-guide',
    type: 'menu',
    envType: 'text',
    parent: 'about',
    textSequence: [
      "Grip Guide:",
      "Use button1 to move forward in the text.",
      "Use button2 to go back or exit.",
    ],
  },

};
