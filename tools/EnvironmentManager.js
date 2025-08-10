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

      // Skip enter anim for parent if current (child) was 'inherit'
      const skipEnterAnim = currentNode?.envType === "inherit" || currentNode?.envType === "text";

      // But still run child's exit animation if defined
      if (currentNode?.exitAnimation) {
        this.transitionAnim(currentNode.exitAnimation, () => {
          this._completeTransition(nextNode, { skipEnterAnim });
        });
      } else {
        this._completeTransition(nextNode, { skipEnterAnim });
      }

      return;
    }

    // Reset path for unrelated jump
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
    const oldNode = this.currentNode;
    const isSameNode = this.currentNodeId === nextNode.id;
    const isSameEnv = nextNode.envType === this.currentNode?.envType;

    // If we are leaving a text node, clear its UI
    if (oldNode?.envType === 'text' && nextNode.envType !== 'text') {
      this.clearTextUI?.();
    }

    // New logic: coming back from a child with 'inherit'
    const comingFromInheritedChild = this.currentNode?.envType === 'inherit' &&
      this.pathStack.includes(nextNode.id);

    // Skip if we're already in same env, or returning from an inherited child
    const skipEnvUpdate = isSameNode ||
      (isSameEnv && this.currentNodeId === nextNode.id) ||
      comingFromInheritedChild;

    this.currentNodeId = nextNode.id;
    this.currentNode = nextNode;

    if (!skipEnterAnim && nextNode.enterAnimation && !skipEnvUpdate) {
      this.transitionAnim(nextNode.enterAnimation, () => {
        this.applyEnvironment(nextNode);
        if (nextNode.envType !== 'text') this.scene.renderMenuItems();
      });
    } else {
      if (!skipEnvUpdate) this.applyEnvironment(nextNode);
      if (nextNode.envType !== 'text') this.scene.renderMenuItems();
    }
  }

  applyEnvironment(node) {
    if (!node) return;

    if (node.envType === 'inherit') {
      console.log(`EnvironmentManager: '${node.id}' inherits environment — skipping environment update.`);
      return;
    }


    if (node.envType !== 'inherit' && node.envType !== 'text') {
      this.clearEnv();
    }

    // Normal environment application for split/solid/transition
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
      case "text":
        this._applyTextEnvironment(node)
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

  // EnvironmentManager.js additions / updates

  textAnim() {
    // Only called when currentNode.envType === 'text'
    // Setup initial text display state

    if (!this.currentNode || this.currentNode.envType !== 'text') return;

    this.clearTextUI();
    this.scene.clearMenuTexts?.();

    const sequence = this.currentNode.textSequence; // We'll store text array here

    if (!Array.isArray(sequence) || sequence.length === 0) {
      console.warn(`[textAnim] No valid text sequence in node '${this.currentNode.id}'`);
      return;
    }

    this.textState = {
      index: 0,
      sequence,
      textObject: null,
      isAnimating: false,
    };

    this._showTextLine();
  }

  _showTextLine() {
    if (!this.textState) return;

    const { index, sequence } = this.textState;
    if (index >= sequence.length) return;

    const line = sequence[index];

    // Destroy old text
    if (this.textState.textObject) this.textState.textObject.destroy();

    const style = { fontSize: '20px', fill: '#fff' };
    const x = 60, y = 60;

    const text = this.scene.add.text(x, y, '', style);
    this.textState.textObject = text;

    let i = 0;
    const fullText = line;
    this.textState.isAnimating = true;

    // Save the timed event so we can cancel it on fast-forward
    this.textState.animEvent = this.scene.time.addEvent({
      delay: 30,
      repeat: fullText.length - 1,
      callback: () => {
        if (!text.active || !text.scene) return; // Prevent crash if destroyed
        text.text += fullText[i];
        i++;
        if (i === fullText.length) {
          this.textState.isAnimating = false;
          this.textState.animEvent = null;
        }
      }
    });
  }

  _textForward() {
    const node = this.currentNode;
    if (!node.textSequence || !this.textState) return;

    // If animating, fast-forward (cancel timer, reveal full text)
    if (this.textState.isAnimating) {
      if (this.textState.animEvent) {
        this.textState.animEvent.remove(false);
        this.textState.animEvent = null;
      }
      const fullText = this.textState.sequence[this.textState.index];
      this.textState.textObject.setText(fullText);
      this.textState.isAnimating = false;
      return; // Important: stop here, don't start new animation
    }

    // Otherwise, go to next text line or parent node if at end
    if (this.textState.index < node.textSequence.length - 1) {
      this.textState.index++;
      this._showTextLine();
    } else {
      const parentId = node.parent;
      if (parentId) {
        this.scene.currentNodeId = parentId;
        this.scene.currentIndex = 0;
        this.goTo(parentId);
      }
    }
  }

  _textBack() {
    const node = this.currentNode;
    if (!node || node.envType !== 'text' || !this.textState) return;

    // 1) If currently animating, finish this line immediately (fast-forward)
    if (this.textState.isAnimating) {
      if (this.textState.animEvent) {
        this.textState.animEvent.remove(false);
        this.textState.animEvent = null;
      }

      const fullText = this.textState.sequence[this.textState.index];
      if (this.textState.textObject && fullText !== undefined) {
        this.textState.textObject.setText(fullText);
      }
      this.textState.isAnimating = false;
      return;  // Stop here to avoid restarting animation
    }

    // 2) If there's a previous line in the sequence, step back one line
    if (this.textState.index > 0) {
      this.textState.index--;
      this._showTextLine();  // Re-render based on updated index
      return;
    }

    // 3) At first line -> go back to parent node
    const parentId = node.parent;
    if (parentId) {
      this.scene.currentNodeId = parentId;
      this.scene.currentIndex = 0;
      this.goTo(parentId);
      return;
    }

    // Optionally, you can log if already at root node (no parent)
    console.log('Already at root node.');
  }

  clearTextUI() {
    if (!this.textState) return;

    if (this.textState.textObject) {
      this.textState.textObject.destroy();
      this.textState.textObject = null;
    }

    this.textState = null;
  }

  _applyTextEnvironment(node) {
    this.activeTextNodeId = node.id;
    this.activeTextIndex = 0;
    this.textAnim(node.textSequence[0]); // display first text
  }
}