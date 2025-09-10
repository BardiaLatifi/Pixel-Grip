export const MENU_TREE = {
  root: {
    id: 'root',
    type: 'menu',
    envType: 'split',
    background: 'background-root',
    movingPart: {
      key: 'fire-root',
      anim: 'fire-root',
      x: 206,
      y: 168,
      config: { start: 0, end: 23, frameRate: 10, loop: true }
    },
    children: ['play', 'options', 'about'],
    menuItems: ['Play', 'Options', 'About']
  },

  play: {
    id: 'play',
    type: 'menu',
    envType: 'text',
    parent: 'root',
    x: 60,
    y: 45,
    fontSize: '16px',
    fontFamily: '"Cormorant Garamond", serif',
    fill: 'black',
    crop: {
      width: 570,
      height: 315
    },
    textSequence: [
      "Hey there! Thanks for checking out the Play menu.\n\nI have to be honest with you... \n\n the actual game isn’t ready just yet.",
      "Pixel Grip is still in its very early stages. \n\n think of this as the foundation work. \n\n Right now, most of my focus is on building the console-style UI \n\n and the main menu system.",
      "The fun stuff is definitely coming! \n\n My plan is to add some engaging mini-games \n\n and interactive features as the project grows.",
      "This is a long-term journey, \n\n so what you’re seeing now is just the starting point. \n\n If you’re curious, stick around and watch how \n\n Pixel Grip evolves over time!",
      "There’s also some extra info about the project \n\n in the About menu — feel free to check it out!"
    ]

  },

  /* this item is not active right now
  play: {
    id: 'play',
    type: 'action',
    parent: 'root',
    background: 'background-play',
    menuItems: [],
    children: []
  },
  */

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
    enterSFX: 'sfx_torch-up',
    exitSFX: 'sfx_torch-down',
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
    menuItems: [
      'Mute UI Sound: OFF',
      'Mute Environment: OFF',
      'Background Music: OFF',
      'Sound Pack: SP1',
      'Reset Default'
    ],
    children: ['mute_ui', 'mute_env', 'music', 'sound_pack', 'reset_audio']
  },

  mute_ui: {
    id: 'mute_ui',
    type: 'option',      // now an option
    action: 'toggle',    // toggles boolean
    parent: 'audio',
    label: 'Mute UI Sound',
    value: false
  },

  mute_env: {
    id: 'mute_env',
    type: 'option',
    action: 'toggle',
    parent: 'audio',
    label: 'Mute Environment',
    value: false
  },

  music: {
    id: 'music',
    type: 'option',
    action: 'selector',  // cycles through options
    parent: 'audio',
    label: 'Background Music',
    options: ['OFF', 'Track 1', 'Track 2'],
    currentIndex: 0
  },

  sound_pack: {
    id: 'sound_pack',
    type: 'option',
    action: 'selector',
    parent: 'audio',
    label: 'Sound Pack',
    options: ['SP1', 'SP2', 'SP3'],
    currentIndex: 0,
    srcs: [  // needed for AudioSystem to pick hover/select/text sounds
      { hover: 'classic_hover', select: 'classic_select', text: 'classic_text' },
      { hover: 'soft_hover', select: 'soft_select', text: 'soft_text' },
      { hover: 'retro_hover', select: 'retro_select', text: 'retro_text' }
    ]
  },

  reset_audio: {
    id: 'reset_audio',
    type: 'option',
    action: 'action',    // special function
    parent: 'audio',
    label: 'Reset Default'
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

  'project-info': {
    id: 'project-info',
    type: 'menu',
    envType: 'text',
    parent: 'about',
    x: 60,
    y: 45,
    fontSize: '16px',
    fontFamily: '"Cormorant Garamond", serif',
    fill: 'black',
    crop: {
      width: 570,
      height: 315
    },
    textSequence: [
      "You might be wondering what exactly this project is.\n\n I'm here to explain what’s going on.",
      "It’s a Virtual Handheld Gaming Console created with Phaser JS.\n\n Phaser is a fast and lightweight game development\n\n framework made for creating 2D games.",
      "We also have some HTML elements styled with CSS,\n\n and Phaser JS works as the engine under the hood.",
      "As you can guess from the project name, 'Pixel Grip'\n\n is a grip for moving pixels.\n\n so you’re going to see pixel art–based games.",
      "All the pixel art and animations were created with \n\n Aseprite, a software for making pixel art images\n\n and sprite sheets.",
      "Phaser works with 'Scenes'. \n\n It stores the data in a scene folder, and you can \n\n navigate through these scenes. \n\n Each scene has its own unique assets to load, \n\n so most of the time you won’t even notice them loading...",
      "Currently, we are in the 'MainMenu.js'  scene,\n\n which is responsible \n\nfor handling the logic and assets of the Main Menu.",
      "Now it’s time to check out the Grip Guide. \n\nI have some useful information there for you."
    ]
  },

  'grip-guide': {
    id: 'grip-guide',
    type: 'menu',
    envType: 'text',
    parent: 'about',
    x: 60,
    y: 45,
    fontSize: '16px',
    fontFamily: '"Cormorant Garamond", serif',
    fill: 'black',
    crop: {
      width: 570,
      height: 325
    },
    textSequence: [
      "How does this handheld console work for the user?",
      "Initialization Scene: \n\n\n As you may have noticed, Pixel Grip detects your \n\n smartphone’s orientation.\n\n If it’s vertical (the default way to hold a SmartPhone),\n\n it will detect this and show a message asking you\n\n to rotate your phone.",
      "If you’ve read the Project Info,\n\n you already know about Phaser Scenes.\n\n The scene that guides you to rotate your phone and\n\n go fullscreen, is the Initialization.js scene.\n\n Each time you change orientation or leave fullscreen mode,\n\n you will return to that scene,\n\n This keeps you from seeing the game screen \n\n until you’re ready.",

      "Console-UI: \n\n\n The User-Interface of the Pixel Grip has 3 columns:\n\n Left-Side | Display | Right-Side\n\n Left-Side and Right-Side are dynamic and may change during\n\n using the console.",
      "Console-UI: Right-Side \n\n\n Right side buttons are the Action Buttons.\n\n You may notice that in the first look the console\n\n had 3 buttons with different Icons.\n\n Now in Main Menu it has 2 buttons: O & X\n\n This happens because of the lack of space.\n\n The buttons must be suitable for the user’s current needs.",
      "Console-UI: Left-Side \n\n\n Like all the gamepads, Left-Side is for Directions.\n\n Like the right side, this one is also dynamic.\n\n It might be a Virtual Analog stick for smooth moving games,\n\n or 4 simple buttons for directions.\n\n The Analog uses Nipple.js library which is powerful\n\n and AWESOME!",
      "Console-UI: Display \n\n\n The display of the console uses 16 / 9 aspect ratio.\n\n It’s 640 * 360 by default\n\n and all the Pixel-Art Sprites follow these dimensions.\n\n Thank God this one is not dynamic!",
      "Main Menu Scene: \n\n\n As you see we are in the Main Menu Scene.\n\n This scene is responsible for displaying\n\n and navigating the Menu Items.\n\n It has Play, Options and About submenus.",
      "'Play' will store the Game Titles.\n\n 'Options' will let you customize the Grip. \n\n And 'About' is HERE WE ARE!!! \n\n A place to introduce this project to you. \n\n This will be updated whenever a new feature is added. \n\n\n Thank You So Much \n\n Hope You Enjoy"
    ]
  },

};
