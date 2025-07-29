import { MENU_TREE } from '../data/Menu-Tree.js';

export default class EnvironmentManager {
  constructor(phaserScene) {
    this.tree = MENU_TREE;
    this.scene = phaserScene;
    this.history = [];
    this.currentNodeId = null;
    this.history = [];
    this.currentBg = null;
    this.currentMovingPart = null;
  }

  setScene(scene) {
    this.scene = scene;
  }

  goTo(nodeId) {
    const nextNode = this.tree[nodeId];
    if (!nextNode) return;

    const currentNode = this.currentNode;

    // If we have an exit animation on current node, play it first
    if (currentNode && currentNode.exitAnimation) {
      this.transitionAnim(currentNode.exitAnimation, () => {
        // After exit animation, switch node and play enter anim if any
        this._completeTransition(nextNode);
      });
    } else {
      // No exit animation, just complete transition directly
      this._completeTransition(nextNode);
    }
  }

  _completeTransition(nextNode) {
    this.currentNodeId = nextNode.id;
    this.currentNode = nextNode;

    // If there is an enter animation on the new node, play it first
    if (nextNode.enterAnimation) {
      this.transitionAnim(nextNode.enterAnimation, () => {
        // After enter animation, apply the environment visuals
        this.applyEnvironment(nextNode);
      });
    } else {
      // No enter animation, apply environment immediately
      this.applyEnvironment(nextNode);
    }
  }


  // goBack() {
  //   if (this.history.length === 0) return;

  //   const previousNodeId = this.history.pop();
  //   this.currentNodeId = previousNodeId;
  //   this.currentNode = this.tree[previousNodeId];

  //   // Perform animation logic or environment setup here
  //   // Example placeholder:
  //   console.log(`Going back to: ${previousNodeId}`);
  // }

  applyEnvironment(node) {
    if (!node) return;

    this.clearEnv(); // remove previous bg and moving parts if any

    // Store current node state
    this.currentNode = node;
    this.currentNodeId = node.id;

    // Animation strategy switch
    switch (node.envType) {
      case "split":
        this.splittedAnim(node);
        break;

      case "solid":
        this.solidAnim(node);
        break;

      case "transition":
        this.transitionAnim(node);
        break;

      default:
        console.warn(`EnvironmentManager: Unknown envType '${node.envType}' for node '${node.id}'`);
        // You can add fallback logic here if needed
        break;
    }

    console.log(`EnvironmentManager: Applied environment for '${node.id}'`);
    console.log(node.envType);
  }





  getCurrent() {
    // Return the current environment node
  }

  clearEnv() {
    if (this.background) {
      this.background.destroy();
      this.background = null;
    }
    if (this.movingPart) {
      this.movingPart.destroy();
      this.movingPart = null;
    }
  }


  solidAnim(node) {
    if (!node || node.envType !== 'solid') {
      console.warn(`solidAnim: Invalid or missing solid config for '${node?.id}'`);
      return;
    }

    this.clearEnv();

    const bgKey = node.background;

    if (!bgKey) {
      console.warn(`solidAnim: No background key defined for '${node.id}'`);
      return;
    }

    if (node.animation) {
      const animKey = bgKey;
      const { start, end, frameRate = 10, loop = false } = node.animation;

      if (!this.scene.anims.exists(animKey)) {
        this.scene.anims.create({
          key: animKey,
          frames: this.scene.anims.generateFrameNumbers(bgKey, { start, end }),
          frameRate,
          repeat: loop ? -1 : 0
        });
      }

      this.background = this.scene.add.sprite(
        node.animation.x || 0,
        node.animation.y || 0,
        bgKey
      ).play(animKey);
    } else {
      this.background = this.scene.add.image(0, 0, bgKey).setOrigin(0);
    }
  }



  splittedAnim() {
    if (!this.currentNode || this.currentNode.envType !== 'split') return;

    const { background, movingPart } = this.currentNode;

    // Create and display background
    if (background) {
      this.background = this.scene.add.image(0, 0, background).setOrigin(0);
    }

    // Validate movingPart config
    if (!movingPart || !movingPart.key || !movingPart.config) {
      console.warn(`splittedAnim: Invalid or missing movingPart config for '${this.currentNode.id}'`);
      return;
    }

    const { key, x = 0, y = 0, config } = movingPart;

    // Only create the animation if it doesn't exist
    if (!this.scene.anims.exists(key)) {
      this.scene.anims.create({
        key: key,
        frames: this.scene.anims.generateFrameNumbers(key, {
          start: config.start,
          end: config.end
        }),
        frameRate: config.frameRate || 10,
        repeat: config.loop ? -1 : 0
      });
    }

    // Create and play the animated sprite
    this.movingPart = this.scene.add.sprite(x, y, key).play(key);
  }

  transitionAnim(animKey, onComplete) {
    const config = this.currentNode?.transitionConfig || {};
    const {
      frameRate = 12,
      start = 0,
      end = -1,
      x = this.scene.cameras.main.width / 2,
      y = this.scene.cameras.main.height / 2,
    } = config;

    if (this.transitionSprite) {
      this.transitionSprite.destroy();
      this.transitionSprite = null;
    }

    this.transitionSprite = this.scene.add.sprite(x, y, animKey).setOrigin(0.5);

    if (!this.scene.anims.exists(animKey)) {
      this.scene.anims.create({
        key: animKey,
        frames: this.scene.anims.generateFrameNumbers(animKey, { start, end }),
        frameRate,
        repeat: 0,
      });
    }

    this.transitionSprite.play(animKey);

    this.transitionSprite.on('animationcomplete', () => {
      this.transitionSprite.destroy();
      this.transitionSprite = null;
      if (onComplete) onComplete();
    });
  }



  transitionEffect(callback) {
    // Optional visual effect (e.g., fade in/out) during transition
  }
}

