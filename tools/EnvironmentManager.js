import { MENU_TREE } from '../data/Menu-Tree.js';

export default class EnvironmentManager {
  constructor(phaserScene) {
    this.tree = MENU_TREE;
    this.scene = phaserScene;
    this.currentNodeId = null;
    this.history = [];
    this.pathStack = ["root"];
    this.currentBg = null;
    this.currentMovingPart = null;
    this.isTransitioning = false;
  }

  setScene(scene) {
    this.scene = scene;
  }

  goTo(nodeId) {
    if (this.isTransitioning) return;

    const nextNode = this.tree[nodeId];
    if (!nextNode) return;

    const currentNode = this.currentNode;

    // ⬇️ Going deeper (into a child)
    if (currentNode?.children?.includes(nodeId)) {
      this.pathStack.push(nodeId);

      const skipTransition = nextNode.envType === "inherit";
      if (skipTransition) {
        this.currentNodeId = nextNode.id;
        this.currentNode = nextNode;
        this.scene.renderMenuItems();
        return;
      }

      this._completeTransition(nextNode);
      return;
    }

    // ⬆️ Going back
    const lastIndex = this.pathStack.length - 2;
    const goingBack = this.pathStack[lastIndex] === nodeId;

    if (goingBack) {
      this.pathStack.pop();

      // ✅ Skip enter anim for parent if current (child) was 'inherit'
      const skipEnterAnim = currentNode?.envType === "inherit";

      // ✅ But still run child's exit animation if defined
      if (currentNode?.exitAnimation) {
        this.transitionAnim(currentNode.exitAnimation, () => {
          this._completeTransition(nextNode, { skipEnterAnim });
        });
      } else {
        this._completeTransition(nextNode, { skipEnterAnim });
      }

      return;
    }

    // 🧹 Reset path for unrelated jump
    this.pathStack = [nodeId];

    if (currentNode?.exitAnimation) {
      this.transitionAnim(currentNode.exitAnimation, () => {
        this._completeTransition(nextNode);
      });
    } else {
      this._completeTransition(nextNode);
    }
  }

  _completeTransition(nextNode, { skipEnterAnim = false } = {}) {
    const isSameNode = this.currentNodeId === nextNode.id;
    const isSameEnv = nextNode.envType === this.currentNode?.envType;

    // 🧠 New logic: coming back from a child with 'inherit'
    const comingFromInheritedChild = this.currentNode?.envType === 'inherit' &&
      this.pathStack.includes(nextNode.id);

    // ✅ Skip if we're already in same env, or returning from an inherited child
    const skipEnvUpdate = isSameNode ||
      (nextNode.envType !== 'inherit' && isSameEnv) ||
      comingFromInheritedChild;

    this.currentNodeId = nextNode.id;
    this.currentNode = nextNode;

    if (!skipEnterAnim && nextNode.enterAnimation && !skipEnvUpdate) {
      this.transitionAnim(nextNode.enterAnimation, () => {
        this.applyEnvironment(nextNode);
        this.scene.renderMenuItems();
      });
    } else {
      if (!skipEnvUpdate) this.applyEnvironment(nextNode);
      this.scene.renderMenuItems();
    }
  }

  applyEnvironment(node) {
    if (!node) return;

    // Skip environment changes for "inherit"
    if (node.envType === 'inherit') {
      console.log(`EnvironmentManager: '${node.id}' inherits environment — skipping environment update.`);
      return;
    }

    this.clearEnv(); // Clean up previous visuals
    this.currentNode = node;
    this.currentNodeId = node.id;

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
    }

    console.log(`EnvironmentManager: Applied environment for '${node.id}'`);
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

  // Helper method inside EnvironmentManager to create animation if missing
  _createAnim(key, start, end, frameRate, loop = false) {
    if (!this.scene.anims.exists(key)) {
      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers(key, { start, end }),
        frameRate,
        repeat: loop ? -1 : 0,
      });
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

      this._createAnim(animKey, start, end, frameRate, loop);

      this.background = this.scene.add.sprite(
        node.animation.x || 0,
        node.animation.y || 0,
        bgKey
      ).play(animKey);
    } else {
      this.background = this.scene.add.image(0, 0, bgKey).setOrigin(0);
    }
  }

  splittedAnim(node) {
    if (!node || node.envType !== 'split') return;

    const { background, movingPart } = node;

    if (background) {
      this.background = this.scene.add.image(0, 0, background).setOrigin(0);
    }

    if (!movingPart || !movingPart.key || !movingPart.config) {
      console.warn(`splittedAnim: Invalid or missing movingPart config for '${node.id}'`);
      return;
    }

    const { key, x = 0, y = 0, config } = movingPart;

    this._createAnim(key, config.start, config.end, config.frameRate || 10, config.loop);

    this.movingPart = this.scene.add.sprite(x, y, key).play(key);
  }

  transitionAnim(animKey, onComplete) {
    if (this.transitionSprite) {
      this.transitionSprite.destroy();
      this.transitionSprite = null;
    }

    this.isTransitioning = true;

    const config = this.currentNode?.transitionConfig || {};
    const {
      frameRate = 12,
      start = 0,
      end = -1,
      x = this.scene.cameras.main.width / 2,
      y = this.scene.cameras.main.height / 2,
    } = config;

    this._createAnim(animKey, start, end, frameRate);

    this.transitionSprite = this.scene.add.sprite(x, y, animKey).setOrigin(0.5);
    this.transitionSprite.play(animKey);

    this.transitionSprite.once('animationcomplete', () => {
      this.transitionSprite.destroy();
      this.transitionSprite = null;
      this.isTransitioning = false;
      if (onComplete) onComplete();
    });
  }

  transitionEffect(callback) {
    // Optional visual effect (e.g., fade in/out) during transition
  }

  textAnim() {
    // this function creates animation like type writing text.
    // it uses text property inside the data (menu tree or other data structures stored in the project) to display the text.
    // the order of its functionality is like that:
    // 1. displays a background for the text. a simple animation from a sprite sheet
    // 2. detects the text placement by a formula (for example 50px 50px from top left corner of the background it just created).
    // 3. displays the text with the type writing animation.
    // 4. displays next icon if there is no answer to take, and displays the answer items if there is.
    // 5. after next/answer goes for next text or next environment.
  }
}