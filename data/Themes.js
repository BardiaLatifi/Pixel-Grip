export const THEMES = {
  Mythological: {
    menuTextColor: '#ffffff',
    textNodeColor: 'black',
    root: {
      envType: 'split',
      background: 'background-root',
      movingPart: {
        key: 'fire-root',
        anim: 'fire-root',
        x: 206,
        y: 168,
        config: { start: 0, end: 23, frameRate: 10, loop: true }
      },
      environmentSounds: [
        { key: 'sfx_fire', volume: 1, loop: true },
        { key: 'sfx_wind', volume: 0.1, loop: true }
      ]
    },

    options: {
      envType: 'solid',
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
    },

    sound: {
      menuItems: [
        'Music: OFF',
        'Sound Pack: Blacksmith-1',
        'Volume',
        'Reset Default'
      ],
    },

    sound_pack: {
      options: ['Blacksmith-1', 'Blacksmith-2', 'Fight-1', 'Fight-2'],
      srcs: [
        { hover: 'hammer1_hover', select: 'hammer1_select', back: 'hammer1_back', text: 'hammer1_text' },
        { hover: 'hammer2_hover', select: 'hammer2_select', back: 'hammer2_back', text: 'hammer2_text' },
        { hover: 'fight1_hover', select: 'fight1_select', back: 'fight1_back', text: 'fight1_text' },
        { hover: 'fight2_hover', select: 'fight2_select', back: 'fight2_back', text: 'fight2_text' },
      ]
    },

    volume: {
      background: 'background-audio', // reuse same bg for seamless look
      menuItems: [
        'Music: 25%',
        'Environment: 100%',
        'UI: 75%'
      ],
      children: ['music_volume', 'environment_volume', 'ui_volume']
    },

    music: {
      options: ['OFF', 'Track-1', 'Track-2', 'Track-3'],
      currentIndex: 0,
    },

    about: {
      envType: 'split',
      background: 'background-about',
      movingPart: {
        key: 'fire-about',
        x: 424,
        y: 166,
        config: { start: 0, end: 23, frameRate: 10, loop: true }
      },
    },

    paper: 'paper-Myth-1'
  },

  Space: {
    menuTextColor: '#ffffff',
    textNodeColor: '#c8fffa',
    root: {
      envType: 'solid',
      background: 'space-background-root',
      animation: {
        start: 0,
        end: 4,
        frameRate: 15,
        loop: true,
        x: 320,
        y: 180
      },
      environmentSounds: []
    },

    options: {
      envType: 'inherit',
    },

    sound: {
      menuItems: [
        'Music: Space-Track-1',
        'Sound Pack: Digital-Sound-1',
        'Volume',
        'Reset Default'
      ],
    },

    sound_pack: {
      options: ['Digital-Sound-1', 'Digital-Sound-2'],
      srcs: [
        { hover: 'digital1_hover', select: 'digital1_select', back: 'digital1_back', text: 'digital1_text' },
        { hover: 'digital2_hover', select: 'digital2_select', back: 'digital2_back', text: 'digital2_text' }
      ]
    },

    volume: {
      background: 'background-audio', // reuse same bg for seamless look
      menuItems: [
        'Music: 25%',
        'UI: 75%'
      ],
      children: ['music_volume', 'ui_volume']
    },

    music: {
      options: ['Space-Track-1', 'Space-Track-2', 'OFF'],
      currentIndex: 0,
    },

    about: {
      envType: 'solid',
      background: 'space-background-root',
      animation: {
        start: 0,
        end: 4,
        frameRate: 15,
        loop: true,
        x: 320,
        y: 180
      }
    },

    paper: 'paper-Space-1'
  }
};
