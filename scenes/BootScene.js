export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    const logo = this.add.image(this.scale.width / 2, this.scale.height / 2, 'phaser-logo')
      .setOrigin(0.5)
      .setAlpha(0);

    // Fade In
    this.tweens.add({
      targets: logo,
      alpha: 1,
      duration: 2000,
      ease: 'Sine.easeIn',
      onComplete: () => {
        // Hold for 1s
        this.time.delayedCall(2000, () => {
          // Fade Out
          this.tweens.add({
            targets: logo,
            alpha: 0,
            duration: 2000,
            ease: 'Sine.easeOut',
          });
        });
      }
    });
  }
}
