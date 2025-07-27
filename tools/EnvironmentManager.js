import { MENU_TREE } from '../data/Menu-Tree.js';

export default class EnvironmentManager {
  constructor(phaserScene) {
    this.tree = MENU_TREE;
    this.scene = phaserScene;
    this.currentNodeId = null;
    this.history = [];
    this.currentBg = null;
    this.currentMovingPart = null;
  }

  goTo(nodeId) {
    if (!this.tree[nodeId]) {
      console.warn(`EnvironmentManager: Node '${nodeId}' does not exist.`);
      return;
    }

    if (this.currentNodeId) {
      this.history.push(this.currentNodeId);
    }

    const prevNode = this.getCurrent();
    const nextNode = this.tree[nodeId];

    this.onExit(prevNode);             // placeholder for future logic
    this.clearEnvironment();           // placeholder
    this.currentNodeId = nodeId;
    this.onEnter(nextNode);            // placeholder
    this.applyEnvironment(nextNode);   // placeholder
  }

  goBack() {
    const current = this.getCurrent();
    if (!current?.parent) {
      console.warn(`EnvironmentManager: No parent to go back to.`);
      return;
    }

    this.goTo(current.parent);
  }

  onEnter(node) {
    // Will be implemented later
  }

  onExit(node) {
    // Will be implemented later
  }

  applyEnvironment(nodeOrId) {
    const node = typeof nodeOrId === 'string' ? MENU_TREE[nodeOrId] : nodeOrId;

    if (!node || !node.id) {
      console.warn(`EnvironmentManager: Node '${nodeOrId}' does not exist.`);
      return;
    }

    console.log('Scene object:', this.scene);

    // 2. Clean up previous background and moving part
    if (this.currentBg) {
      this.currentBg.destroy();
      this.currentBg = null;
    }
    if (this.currentMovingPart) {
      this.currentMovingPart.destroy();
      this.currentMovingPart = null;
    }

    // 3. Apply static background
    if (node.background) {
      this.currentBg = this.scene.add.image(0, 0, node.background).setOrigin(0, 0);
    }

    // 4. Apply moving part animation
    if (node.movingPart) {
      const { key, x, y, config } = node.movingPart;

      // Create animation if it doesn't already exist
      const animKey = `${key}-anim`;
      if (!this.scene.anims.exists(animKey)) {
        this.scene.anims.create({
          key: animKey,
          frames: this.scene.anims.generateFrameNumbers(key, { start: config.start, end: config.end }),
          frameRate: config.frameRate,
          repeat: config.loop ? -1 : 0
        });
      }

      // Add sprite and play animation
      this.currentMovingPart = this.scene.add.sprite(x, y, key);
      this.currentMovingPart.play(animKey);
    }

    console.log(`EnvironmentManager: Environment applied for '${node.id}'`);

  }

  clearEnvironment() {
    // Will be implemented later
  }

  waitForAnimation(sprite) {
    return new Promise(resolve => {
      sprite.once('animationcomplete', () => resolve());
    });
  }
}
