export const MENU_TREE = {
  root: {
    id: 'root',
    type: 'menu',
    background: 'background-root',
    movingPart: {
      key: 'fire-root',
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
    parent: 'root',
    background: 'options-loop',
    enterAnimation: 'options-enter',
    exitAnimation: 'options-exit',
    children: ['audio', 'controls', 'themes'],
    menuItems: ['Audio', 'Controls', 'Themes']
  },

  audio: {
    id: 'audio',
    type: 'menu',
    parent: 'options',
    background: 'background-audio',
    menuItems: [],
    children: []
  },

  controls: {
    id: 'controls',
    type: 'menu',
    parent: 'options',
    background: 'background-controls',
    menuItems: [],
    children: []
  },

  themes: {
    id: 'themes',
    type: 'menu',
    parent: 'options',
    background: 'background-themes',
    menuItems: [],
    children: []
  },

  about: {
    id: 'about',
    type: 'menu',
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

  'project-info': {
    id: 'project-info',
    type: 'menu',
    parent: 'about',
    background: 'background-project-info',
    menuItems: [],
    children: []
  },

  'grip-guide': {
    id: 'grip-guide',
    type: 'menu',
    parent: 'about',
    background: 'background-grip-guide',
    menuItems: [],
    children: []
  }
};
