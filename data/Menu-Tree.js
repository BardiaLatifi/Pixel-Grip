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
      "You might be wondering what exactly this project is.\n\n I'm here to explain what’s going on.",
      "It’s a VIRTUAL HANDHELD GAMING CONSOLE\n\n created with Phaser JS.\n\n Phaser is a fast and lightweight game development\n\n framework made for creating 2D games.",
      "We also have some HTML elements styled with CSS,\n\n and Phaser JS works as the engine under the hood.",
      "As you can guess from the project name, 'Pixel Grip'\n\n is a grip for moving pixels\n\n so you’re going to see pixel art–based games.",
      "All the pixel art and animations were created with \n\n Aseprite, a software tool for making pixel art images\n\n and sprite sheets.",
      "Phaser works with 'Scenes'. \n\nIt stores the data in a scene folder, and you can \n\n navigate through these scenes. \n\nEach scene has its own unique assets to load, \n\n so most of the time you won’t even notice them loading...",
      "Currently, we are in the 'MainMenu.js'  scene,\n\n which is responsible \n\nfor handling the logic and assets of the Main Menu.",
      "Now it’s time to check out the Grip Guide. \n\nI have some useful information there for you."
    ]
  },

  'grip-guide': {
    id: 'grip-guide',
    type: 'menu',
    envType: 'text',
    parent: 'about',
    textSequence: [
      "How does this handheld console work for the user?",
      "Initialization Scene: \n\n \n\n As you may have noticed, Pixel Grip detects your \n\n smartphone’s orientation.\n\nIf it’s vertical (which most smartphones are by default),\n\nit will detect this and show a message asking you\n\n to rotate your phone.",
      "If you’ve read the Project Info,\n\n you already know about Phaser Scenes\n\nThe scene that guides you to rotate your phone and\n\ngo fullscreen, is the Initialization.js scene.\n\nEach time you change orientation or leave fullscreen mode,\n\nyou will return to that scene,\n\n This keeps you from seeing the game screen \n\n until you’re ready.",

      "Console-UI:\n\nThe User-Interface of the Pixel Grip has 3 columns:\n\nLeft-Side | Display | Right-Side\n\nLeft-Side and Right-Side are dynamic and may change during\n\nusing the console.",
      "Console-UI: Right-Side\n\nRight side buttons are the Action Buttons.\n\nYou may notice that in the first look the console\n\nhad 3 buttons with different Icons.\n\nNow in Main Menu it has 2 buttons: O & X\n\nThis happens because of the lack of space.\n\nThe buttons must be suitable for the user’s current needs.",
      "Console-UI: Left-Side\n\nLike all the gamepads, Left-Side is for Directions.\n\nLike the right side, this one is also dynamic.\n\nIt might be a Virtual Analog stick for smooth moving games,\n\nor 4 simple buttons for directions.\n\nThe Analog uses Nipple.js library which is powerful\n\nand AWESOME!",
      "Console-UI: Display\n\nThe display of the console uses 16 / 9 aspect ratio.\n\nIt’s 640 * 360 by default\n\nand all the Pixel-Art Sprites follow these dimensions.\n\nThank God this one isn’t dynamic!",
      "Main Menu Scene:\n\nAs you see we are in the Main Menu Scene\n\nwhich is responsible for displaying\n\n and navigating the Menu Items.\n\nIt has Play, Options and About submenus.\n\nPlay will store the Game Titles.\n\nOptions will let you customize the Grip!\n\nAnd About is HERE WE ARE!!!\n\nA place to introduce this project to you.\n\nIt’s updated whenever new features are added."
    ]
  },

};
