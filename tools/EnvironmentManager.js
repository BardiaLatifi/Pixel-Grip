import { MENU_TREE } from '../data/Menu-Tree.js';

export default class EnvironmentManager {
  constructor(phaserScene) {
    this.tree = MENU_TREE;
    this.scene = phaserScene;
    this.currentNodeId = 'root';
    this.currentNode = this.tree[this.currentNodeId];
    this.pathStack = ["root"];
    this.currentBg = null;
    this.currentMovingPart = null;
    this.isTransitioning = false;
    this.currentLanguage = 'en';
  }

  setScene(scene) {
    this.scene = scene;
  }

  goTo(nodeId) {
    if (this.isTransitioning) return;

    const nextNode = this.tree[nodeId];
    if (!nextNode) return;

    const currentNode = this.currentNode; // ✅ this is effectively your "prevNode"

    // ⬇️ Going deeper (into a child)
    if (currentNode?.children?.includes(nodeId)) {
      this.pathStack.push(nodeId);

      // ✅ Dynamic enter sound
      if (nextNode.enterSFX) {
        this.scene.playSFX(nextNode.enterSFX, 0.8);
      } else {
        this.scene.playSFX(this.scene.selectSFX, 0.8);
      }

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

      // ✅ Dynamic exit sound
      if (currentNode.exitSFX) {
        this.scene.playSFX(currentNode.exitSFX, 0.8);
      } else {
        this.scene.playSFX(this.scene.backSFX, 0.8);
      }

      // Skip enter anim for parent if current (child) was 'inherit'
      const skipEnterAnim =
        currentNode?.envType === "inherit" || currentNode?.envType === "text";

      // But still run child's exit animation if defined
      if (currentNode?.exitAnimation) {
        this.transitionAnim(
          currentNode.exitAnimation,
          () => {
            this._completeTransition(nextNode, { skipEnterAnim });
          },
          currentNode.exitSFX
        );
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
      }, nextNode.enterSFX);
    } else {
      if (!skipEnvUpdate) this.applyEnvironment(nextNode);
      if (nextNode.envType !== 'text') this.scene.renderMenuItems();
    }
  }

  applyEnvironment(node) {
    if (!node) return;

    // Handle text mode button visibility
    if (node.envType === 'text') {
      button3.style.display = 'block';
      button3.innerHTML = 'EN';
    } else {
      button3.style.display = 'none';
    }

    // Clear previous environment if needed
    if (node.envType !== 'inherit' && node.envType !== 'text') {
      this.clearEnv();
    }

    // Apply the correct visual environment
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
        this._applyTextEnvironment(node);
        break;
      default:
        console.warn(`EnvironmentManager: Unknown envType '${node.envType}' for node '${node.id}'`);
    }

    // 🎧 Apply environment sounds if defined
    if (node.environmentSounds) {
      this.scene.sound.sounds.forEach(sound => {
        if (sound.key.startsWith('sfx_')) sound.stop();
      });

      node.environmentSounds.forEach(snd => {
        this.scene.playSFX(snd.key, snd.volume ?? 1, snd.loop ?? true);
      });

      console.log(`[EnvironmentManager] Environment sounds applied for '${node.id}'`);
    }

    // 🎵 Apply default theme music only once, on root
    if (node.id === 'root' && !this.scene.currentMusic) {
      const musicNode = MENU_TREE['music'];
      if (musicNode && musicNode.options && musicNode.currentIndex != null) {
        const track = musicNode.options[musicNode.currentIndex];
        if (track !== 'OFF') {
          this.scene.currentMusic = this.scene.sound.add(track, {
            volume: this.scene.volumeSettings.music ?? 0.25,
            loop: true,
          });
          this.scene.currentMusic.play();
          console.log(`[EnvironmentManager] Default theme music started: ${track}`);
        }
      }
    }

    console.log(`EnvironmentManager: Applied environment for '${node.id}'`);
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

  transitionAnim(animKey, onComplete, sfxKey) {
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

    // ✅ Play sound immediately if provided
    if (sfxKey && this.scene.playSFX) {
      this.scene.playSFX(sfxKey, 0.8);  // You can adjust volume
    }

    // Handle animation complete
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

    // Destroy old text
    if (this.textState.textObject) {
      this.textState.textObject.destroy();
      this.textState.textObject = null;
    }

    // ----- STYLE (base) -----
    const style = {
      fontSize: this.currentLanguage === 'fa' ? '16px' : '19px',
      fontFamily: this.currentLanguage === 'fa' ? 'Vazirmatn' : 'EB Garamond',
      fontWeight: this.currentLanguage === 'fa' ? '400' : '800',
      fill: this.currentNode.fill,
      wordWrap: { width: this.currentNode.crop?.width || 0, useAdvancedWrap: true }
    };


    // ----- PAPER BACKGROUND (create BEFORE text so we can compute edges) -----
    if (this.currentNode.crop) {
      if (!this.textState.paperObject) {
        const px = 0;
        const py = 0;
        const pw = this.currentNode.crop.width;
        const ph = this.currentNode.crop.height;
        this.textState.paperObject = this.scene.add.image(this.currentNode.x - 25, this.currentNode.y - 25, 'paper')
          .setOrigin(0, 0)
          .setCrop(px, py, pw, ph)
          .setDepth(0);
      }
    }

    // ----- TEXT POSITION (base) -----
    let x = this.currentNode.x;
    let y = this.currentNode.y;

    // create text object with base style
    const text = this.scene.add.text(x, y, '', style);
    this.textState.textObject = text;

    // ----- RTL / LTR handling -----
    if (this.currentLanguage === 'fa') {
      // compute paper right edge (fallback to node crop width if no paper)
      const pw = this.currentNode.crop?.width ?? 0;
      const paperLeft = this.currentNode.x - 40; // matches how paper was placed
      const rightEdgeX = paperLeft + pw;
      button3.innerHTML = 'FA';

      // anchor to right and place at right edge (subtract small padding if needed)
      const paddingRight = 12; // tweak if you want more/less inner margin
      text.setOrigin(1, 0);                    // anchor at right
      text.setX(rightEdgeX - paddingRight);    // align right edge inside paper
      text.setStyle({ align: 'right', direction: 'rtl' }); // update style after creation
    } else if (this.currentLanguage === 'en') {
      // LTR: anchor left and ensure left X (you can add left padding if needed)
      const paddingLeft = 0;
      text.setOrigin(0, 0);
      text.setX(this.currentNode.x + paddingLeft);
      text.setStyle({ align: 'left', direction: 'ltr' });
      button3.innerHTML = 'EN';
    }

    // ----- ANIMATION -----
    let i = 0;
    const lineObj = sequence[index];
    const fullText = (lineObj && lineObj[this.currentLanguage]) || "";
    this.textState.isAnimating = true;

    // Cancel any previous event
    if (this.textState.animEvent) {
      this.textState.animEvent.remove(false);
      this.textState.animEvent = null;
    }

    this.textState.animEvent = this.scene.time.addEvent({
      delay: 30,
      repeat: Math.max(0, fullText.length - 1),
      callback: () => {
        if (!text.active || !text.scene) return;
        const char = fullText[i];
        text.text += char;

        if (char === " " || i === fullText.length - 1) {
          this.scene.playSFX(this.scene.textSFX, 0.5);
        }

        i++;
        if (i === fullText.length) {
          this.textState.isAnimating = false;
          this.textState.animEvent = null;
        }
      }
    });

    text.setDepth(1);
  }


  _textForward() {
    const node = this.currentNode;
    if (!node.textSequence || !this.textState) return;

    const lineObj = this.textState.sequence[this.textState.index];
    const fullText = lineObj[this.currentLanguage] || "";
    this.textState.textObject.setText(fullText);

    // If animating, fast-forward (cancel timer, reveal full text)
    if (this.textState.isAnimating) {
      if (this.textState.animEvent) {
        this.textState.animEvent.remove(false);
        this.textState.animEvent = null;
      }
      this.textState.textObject.setText(fullText);
      this.textState.isAnimating = false;
      return; // Important: stop here, don't start new animation
    }

    // Otherwise, go to next text line or parent node if at end
    if (this.textState.index < node.textSequence.length - 1) {
      this.textState.index++;
      this._showTextLine();
    } else {
      // Destroy paper when leaving node
      if (this.textState.paperObject) {
        this.textState.paperObject.destroy();
        this.textState.paperObject = null;
      }
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

    const lineObj = this.textState.sequence[this.textState.index];
    const fullText = lineObj[this.currentLanguage] || "";
    this.textState.textObject.setText(fullText);

    // 1) If currently animating, finish this line immediately (fast-forward)
    if (this.textState.isAnimating) {
      if (this.textState.animEvent) {
        this.textState.animEvent.remove(false);
        this.textState.animEvent = null;
      }

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
    if (this.textState.paperObject) {
      this.textState.paperObject.destroy();
      this.textState.paperObject = null;
    }
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

    // ----- DESTROY PAPER -----
    if (this.textState.paperObject) {
      this.textState.paperObject.destroy();
      this.textState.paperObject = null;
    }
    this.textState = null;
  }

  _applyTextEnvironment(node) {
    this.activeTextNodeId = node.id;
    this.activeTextIndex = 0;
    this.textAnim(node.textSequence[0]); // display first text
  }
}