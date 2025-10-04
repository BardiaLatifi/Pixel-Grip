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
    fill: 'black',
    crop: {
      width: 570,
      height: 315
    },
    textSequence: [
      {
        en: "Hey there! I see you are trying to Play some games with the Grip.\n\nI have to be honest with you... \n\n the actual game isn’t ready just yet.",
        fa: ".درود بر شما. خوشحالم که پیکسل گریپ رو لایق تست بازی دیدید\n\n .اما متاسفانه باید بگم که هنوز هیچ بازی در دسترس نیست\n\n"
      },
      {
        en: "Pixel Grip is still in its very early stages. \n\n think of this as the foundation work of a long term project \n\n Right now, most of my focus is on building the console-style UI \n\n and a unique main menu system.",
        fa: "پیکسل گریپ هنوز در مراحل ابتدایی از یک پروژه‌ی بلند مدت هست\n\n ،و در حال حاضر تمام تمرکز بر روی ساخت یک رابط کاربری به شکل کنسول دستی\n\n .و البته یک منو با قابلیت های خاص خودش هست"
      },
      {
        en: "The fun stuff is definitely coming! \n\n My plan is to add some engaging mini-games \n\n and interactive features as the project grows.",
        fa: ".قطعا کار به اینجا ختم نمی‌شه و بازی‌هایی هم در راه خواهند بود \n\n .به مرور بازی‌هایی با گیم پلی مناسب این پروژه به کار اضافه خواهند شد \n\n .و در طول کار، به قابلیت‌های کنسول افزوده خواهد شد"
      },
      {
        en: "If you’re curious,\n\n stick around and watch how Pixel Grip evolves over time!",
        fa: "،اگر ایده‌ی پیکسل گریپ برات جذابه و کنجکاوی بدونی در آینده به کجا می‌رسه\n\n .با هر بروزرسانی با من همراه باش تا سِیر پیشرفت و گسترش اون رو شاهد باشی"
      },
      {
        en: "There’s also some extra info about the project \n\n in the About menu — feel free to check it out!",
        fa: ".توی قسمت 'اطلاعات پروژه' توضیاحات کاملی در مورد کارکرد پیکسل گریپ قرار دادم\n\n .اینکه چطور کار می‌کنه و از چه ابزارها و کتابخانه‌ای استفاده می‌کنه"
      },
      {
        en: "In the last update i have completed the Audio System\n\n You can take look at the Options Menu.",
        fa: "در حال حاضر بخش تنظیمات صدا به مراحل خوبی رسیده\n\n .می‌تونی به اونجا هم سری بزنی"
      }
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
      'Music: OFF',
      'Sound Pack: Blacksmith-1',
      'Volume',
      'Reset Default'
    ],
    children: ['music', 'sound_pack', 'volume', 'reset_audio']
  },

  music: {
    id: 'music',
    type: 'option',
    parent: 'audio',
    label: 'Music',
    options: ['OFF', 'Track-1', 'Track-2', 'Track-3'],
    currentIndex: 0
  },

  sound_pack: {
    id: 'sound_pack',
    type: 'option',
    parent: 'audio',
    label: 'Sound Pack',
    options: ['Blacksmith-1', 'Blacksmith-2', 'Fight-1', 'Fight-2', 'Digital-1', 'Digital-2',],
    currentIndex: 0,
    srcs: [
      { hover: 'hammer1_hover', select: 'hammer1_select', back: 'hammer1_back', text: 'hammer1_text' },
      { hover: 'hammer2_hover', select: 'hammer2_select', back: 'hammer2_back', text: 'hammer2_text' },
      { hover: 'fight1_hover', select: 'fight1_select', back: 'fight1_back', text: 'fight1_text' },
      { hover: 'fight2_hover', select: 'fight2_select', back: 'fight2_back', text: 'fight2_text' },
      { hover: 'digital1_hover', select: 'digital1_select', back: 'digital1_back', text: 'digital1_text' },
      { hover: 'digital2_hover', select: 'digital2_select', back: 'digital2_back', text: 'digital2_text' }
    ]
  },

  volume: {
    id: 'volume',
    type: 'menu',
    envType: 'inherit', // seamless like audio
    parent: 'audio',
    label: 'Volume',
    background: 'background-audio', // reuse same bg for seamless look
    menuItems: [
      'Music: 25%',
      'Environment: 100%',
      'UI: 75%'
    ],
    children: ['music_volume', 'environment_volume', 'ui_volume']
  },

  music_volume: {
    id: 'music_volume',
    type: 'option',
    parent: 'volume',
    label: 'Music',
    options: ['Mute', '25%', '50%', '75%', '100%'],
    currentIndex: 1 // default 50%
  },

  environment_volume: {
    id: 'environment_volume',
    type: 'option',
    parent: 'volume',
    label: 'Environment',
    options: ['Mute', '25%', '50%', '75%', '100%'],
    currentIndex: 4 // default 100%
  },

  ui_volume: {
    id: 'ui_volume',
    type: 'option',
    parent: 'volume',
    label: 'UI',
    options: ['Mute', '25%', '50%', '75%', '100%'],
    currentIndex: 3 // default 75%
  },

  reset_audio: {
    id: 'reset_audio',
    type: 'option',
    parent: 'audio',
    label: 'Reset Default'
  },

  // under development

  // controls: {
  //   id: 'controls',
  //   type: 'menu',
  //   envType: 'inherit',
  //   parent: 'options',
  //   background: 'background-controls',
  //   menuItems: [],
  //   children: []
  // },

  controls: {
    id: 'controls',
    type: 'menu',
    envType: 'text',
    parent: 'options',
    x: 60,
    y: 45,
    fill: 'black',
    crop: {
      width: 570,
      height: 325
    },
    textSequence: [
      {
        en: "This part is under development...",
        fa: "...این بخش در دست ساخت است"
      },
    ]
  },

  // under development

  themes: {
    id: 'themes',
    type: 'menu',
    envType: 'text',
    parent: 'options',
    x: 60,
    y: 45,
    fill: 'black',
    crop: {
      width: 570,
      height: 325
    },
    textSequence: [
      {
        en: "This part is under development...",
        fa: "...این بخش در دست ساخت است"
      },
    ]
  },
  // themes: {
  //   id: 'themes',
  //   type: 'menu',
  //   envType: 'inherit',
  //   parent: 'options',
  //   background: 'background-themes',
  //   menuItems: [],
  //   children: []
  // },

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
    fill: 'black',
    crop: {
      width: 570,
      height: 315
    },
    textSequence: [
      {
        en: "You might be wondering what exactly this project is.\n\n I'm here to explain what’s going on.",
        fa: ".شاید یه مقدار چیستی و چرایی این پروژه برای شما ملموس نباشه\n\n .اینکه اصلا چی هست و چطور کار می‌کنه\n\n\n .در ادامه این مورد رو توضیح می‌دم"
      },
      {
        en: "It’s a Virtual Handheld Gaming Console created with Phaser JS.\n\n Phaser is a fast and lightweight game development\n\n framework made for creating 2D games.",
        fa: ".پیکسل گریپ در اصل یک کنسول دستی مجازی تحت وب هست\n\n .که به کمک انجین فِیزِر کار می کنه\n\n .فیزر یک کتابخانه جاواسکریپت برای ساخت بازی‌های دو بعدی هست"
      },
      {
        en: "We also have some HTML elements styled with CSS,\n\n and Phaser JS works as the engine under the hood.",
        fa: ".ما اینجا یک رابط کاربری کنسول شکل با تگ‌های اچ‌تی‌ام‌ال داریم\n\n .که با سی‌اس‌اس استایل داده شدن\n\n .و فیزر مثل موتور محرکه‌ی اصلی این کنسول کار می‌کنه"
      },
      {
        en: "As you can guess from the project name, 'Pixel Grip'\n\n is a grip for moving pixels.\n\n so you’re going to see pixel art–based games.",
        fa: "همونطور که می تونید از اسم پروژه حدس بزنید\n\n .پیکسل گریپ یک وسیله برای تعامل با تصاویر پیکسل آرته\n\n .پس اینجا قراره تمام بازی‌ها بر مبنای پیکسل آرت و دو بعدی باشن"
      },
      {
        en: "All the pixel art and animations were created with \n\n Aseprite, a software for making pixel art images\n\n and sprite sheets.",
        fa: ".تمام تصاویر پیکسل آرت و انیمشن‌ها با نرم افزار اِیسپرایت ساخته شدن\n\n .ایسپرایت یک ابزار فوق العاده برای ساخت انیمیشن‌های پیکسل محوره"
      },
      {
        en: "Phaser works with 'Scenes'. \n\n It stores the data in a scene folder, and you can \n\n navigate through these scenes. \n\n Each scene has its own unique assets to load, \n\n so most of the time you won’t even notice them loading...",
        fa: ".اما در مورد فیزر یک نکته‌ی خیلی مهم هست\n\n .این انجین با فولدرهایی به نام سین یا صحنه کار می‌کنه\n\n ،هر صحنه فایل‌ها و کد‌های خودش رو داره و لود شدن این منابع \n\n .قبل از وارد شدن به صحنه انجام می‌شه\n\n.در نتیجه تجربه‌ی منو‌ها و بازی‌ها تقریبا بدون زمان انتظار لودینگ خواهد بود"
      },
      {
        en: "Currently, we are in the 'MainMenu.js'  scene,\n\n which is responsible \n\nfor handling the logic and assets of the Main Menu.",
        fa: ".ما در حال حاضر در صحنه‌ی منوی اصلی هستیم\n\n .منوی اصلی یک فایل جاواسکریپته که لاجیک‌های یونیک خودش رو داره"
      },
      {
        en: "Now it’s time to check out the Grip Guide. \n\nI have some useful information there for you.",
        fa: ".فکر می‌کنم وقت مناسبی باشه که سری به بخش راهنمای کنسول بزنید\n\n .اونجا اطلاعات کاربردی بیشتری برای شما قرار دادم"
      }
    ]

  },

  'grip-guide': {
    id: 'grip-guide',
    type: 'menu',
    envType: 'text',
    parent: 'about',
    x: 60,
    y: 45,
    fill: 'black',
    crop: {
      width: 570,
      height: 325
    },
    textSequence: [
      {
        en: "How does this handheld console work for the user?",
        fa: ".اما بپردازیم به اینکه این کنسول دستی دقیقا چطور کار می‌کنه"
      },
      {
        en: "Initialization Scene: \n\n\n As you may have noticed, Pixel Grip detects your\n\n smartphone’s orientation.\n\n If it’s vertical (the default way to hold a SmartPhone),\n\n it will detect this and show a message asking you\n\n to rotate your phone.",
        fa: ":بخش آماده سازی اولیه\n\n همونطور که تا الان متوجه شدید پیکسل گریپ می‌تونه تشخیص بده\n\n .که گوشی عمودی هست یا افقی\n\n ،اگر گوشی هوشمند شما به شکل عمودی گرفته شده باشه \n\n (که حالت پیشفرض برای تلفن همراه هست)\n\n .همه چیز متوقف می‌شه و پیام چرخاندن موبایل برای شما به نمایش در میاد"
      },
      {
        en: "If you’ve read the Project Info,\n\n you already know about Phaser Scenes.\n\n The scene that guides you to rotate your phone and\n\n go fullscreen, is the Initialization.js scene.\n\n Each time you change orientation or leave fullscreen mode,\n\n you will return to that scene, This keeps you from\n\n seeing the game screen until you’re ready.",
        fa: "در واقع صحنه‌ای که از نمایش رابط کاربری\n\n ،در صورت عمودی بودن موبایل جلوگیری می‌کنه\n\n .صحنه‌ی آماده سازی اولیه نام داره\n\n اگر مرورگر موبایل از حالت فول اسکرین خارج بشه یا اینکه به صورت عمودی دربیاد\n\n .شما به اجبار به صحنه‌ی آماده سازی اولیه ارجاع داده می‌شید"
      },
      {
        en: "Console-UI: \n\n\n The User-Interface of the Pixel Grip has 3 columns:\n\n Left-Side | Display | Right-Side\n\n Left-Side and Right-Side are dynamic and may change during\n\n using the console.",
        fa: ":رابط کاربری کنسول شکل\n\n\n :رابط کاربری در پیکسل گریپ دارای سه ستون اصلی هست\n\n سمت راست | نمایشگر | سمت چپ\n\n دکمه‌ها و چیدمان سمت چپ و راست یه شکل پویا \n\n .در طول تجربه‌ی کاربری تغییر می‌کنن"
      },
      {
        en: "Console-UI: Right-Side \n\n Right side buttons are the Action Buttons.\n\n You may notice that in the first look the console\n\n had 3 buttons with different Icons.\n\n Now in Main Menu it has 2 buttons: O & X\n\n This happens because of the lack of space.\n\n The buttons must be suitable for the user’s current needs.",
        fa: "رابط کاربری کنسول شکل: سمت راست\n\n\n .دکمه‌های سمت راست دکمه‌های عملیاتی هستند\n\n ممکنه متوجه این موضوع شده باشید که وقتی برای بار اول رابط کاربری رو می‌بینید\n\n .سه دکمه با آیکون‌های متفاوت وجود دارن که با ورود به منوی اصلی تغییر می‌کنن\n\n ،به دلیل کمبود جا و اینکه دکمه‌ها باید بزرگ و واضح باشن\n\n .سعی شده هر بار بنا به نیاز کاربر، دکمه‌های اضافه حذف بشن"
      },
      {
        en: "Console-UI: Left-Side \n\n Like all the gamepads, Left-Side is for Directions.\n\n Like the right side, this one is also dynamic.\n\n It might be a Virtual Analog stick for smooth moving games,\n\n or 4 simple buttons for directions.\n\n The Analog uses Nipple.js library which is powerful\n\n and AWESOME!",
        fa: "رابط کاربری کنسول شکل: سمت چپ\n\n\n .مثل تمام گیم پد‌های دنیا، سمت چپ جایی برای دکمه‌های جهت دهیه\n\n .مثل سمت راست کنسول، سمت چپ هم پویا و تغییر پذیره\n\n ،زمانی که در اجرای یک بازی نیاز به آنالوگ برای جهت دهی باشه\n\n .دکمه‌های جهت دهی حذف، و آنالوگ استیک جای اون‌ها رو می‌گیره\n\n .برای آنالوگ از کتابخوانه‌ی نیپل استفاده شده"
      },
      {
        en: "Console-UI: Display \n\n\n The display of the console uses 16 / 9 aspect ratio.\n\n It’s 640 * 360 by default\n\n and all the Pixel-Art Sprites follow these dimensions.\n\n Thank God this one is not dynamic!",
        fa: "رابط کاربری کنسول شکل: نمایشگر\n\n\n .نسبت تصویر در کنسول پیکسل گریپ 16 به 9 هست\n\n .نمایشگر پیکسل گریپ از ابعاد 640 در 360 پیکسل استفاده می‌کنه\n\n .در نتیجه تمام انیمیشن‌ها و اسپرایت شیت‌ها از این نسبت پیروی می‌کنن\n\n .این مورد پویا نیست و همیشه همین نسبت رو حفظ می‌کنه"
      },
      {
        en: "Main Menu Scene: \n\n\n As you see we are in the Main Menu Scene.\n\n This scene is responsible for displaying\n\n and navigating the Menu Items.\n\n It has Play, Options and About submenus.",
        fa: " :صفحه‌ی منوی اصلی\n\n\n .همونطور که می‌بینید در حال حاضر ما در صحنه‌ی منوی اصلی هستیم\n\n .این صحنه از فولدر صحنه‌های فیزر، مسولیت نمایش آیتم‌های منو رو به عهده داره\n\n .در حال حاضر سه بخش 'بازی' 'تنظیمات' و 'درباره‌ی پروژه' وجود دارن"
      },
      {
        en: "'Play' will store the Game Titles.\n\n 'Options' will let you customize the Grip. \n\n And 'About' is HERE WE ARE!!! \n\n A place to introduce this project to you. \n\n This will be updated whenever a new feature is added. \n\n\n Thank You So Much \n Hope You Enjoy...",
        fa: ".بخش 'بازی' یا 'پلی' قرار هست که بازی‌ها رو در خودش لیست کنه\n\n .در منوی 'تنظیمات' می‌تونید گریپ رو شخصی سازی کنید\n\n !و بخش 'درباره‌ی پروژه' همین جایی هست که در اون هستیم\n\n جایی که در اون با گسترش پروژه، اطلاعات بروز شده \n\n .و قابلیت‌های جدید کنسول رو برای شما توضیح می‌دم\n\n .از اینکه بخش توضیحات رو تا اینجا دنبال کردید متشکرم\n\n .امیدوارم از تجربتون با پیکسل گریپ لذت ببرید"
      }
    ]
  },

};
