export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
    this.optionButtonHeld = false;
  }

  create() {
    // Phaser logo
    const phaserLogo = this.add.image(this.scale.width / 2, this.scale.height / 2, 'phaser-logo')
      .setOrigin(0.5)
      .setAlpha(0);

    // Your logo (Pixel Grip)
    const pgLogo = this.add.image(this.scale.width / 2, this.scale.height / 2, 'pixelgrip-logo')
      .setOrigin(0.5)
      .setAlpha(0);

    // Slogan (above your logo)
    const slogan = this.add.image(this.scale.width / 2, this.scale.height / 2, 'slogan')
      .setOrigin(0.5)
      .setAlpha(0);

    // Press Option button prompt
    const pressPrompt = this.add.image(this.scale.width / 2, this.scale.height / 2, 'press-option')
      .setOrigin(0.5)
      .setAlpha(0);

    // Step 1: Fade in Phaser logo
    this.tweens.add({
      targets: phaserLogo,
      alpha: 1,
      duration: 1000,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          // Step 2: Fade out Phaser logo
          this.tweens.add({
            targets: phaserLogo,
            alpha: 0,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
              // Step 3: Fade in your logo
              this.tweens.add({
                targets: pgLogo,
                alpha: 1,
                duration: 1500,
                ease: 'Sine.easeIn',
              });

              // Step 4: Fade in slogan after logo
              this.time.delayedCall(1500, () => {
                this.tweens.add({
                  targets: slogan,
                  alpha: 1,
                  duration: 1500,
                  ease: 'Sine.easeIn',
                  onComplete: () => {
                    this.time.delayedCall(2000, () => {
                      // Step 5: Fade out slogan
                      this.tweens.add({
                        targets: slogan,
                        alpha: 0,
                        duration: 1500,
                        ease: 'Sine.easeOut',
                        onComplete: () => {
                          // Step 6: Show press option prompt
                          this.tweens.add({
                            targets: pressPrompt,
                            alpha: 1,
                            duration: 500,
                            ease: 'Sine.easeIn',
                            onComplete: () => {
                              // Start blinking
                              this.startBlinking(pressPrompt);
                              // Enable button interaction
                              this.enableOptionButton(pressPrompt);
                            }
                          });
                        }
                      });
                    });
                  }
                });
              });
            }
          });
        });
      }
    });
  }

  startBlinking(target) {
    this.blinkTween = this.tweens.add({
      targets: target,
      alpha: { from: 1, to: 0.3 },
      duration: 500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  stopBlinking(target) {
    if (this.blinkTween) {
      this.blinkTween.stop();
      target.setAlpha(1); // Reset to fully visible
    }
  }

  enableOptionButton(prompt) {
    const btn = document.getElementById('option-btn');
    if (!btn) return;

    const handleHold = () => {
      if (!this.optionButtonHeld) {
        this.optionButtonHeld = true;
        this.stopBlinking(prompt);

        // Fade out prompt
        this.tweens.add({
          targets: prompt,
          alpha: 0,
          duration: 800,
          ease: 'Sine.easeOut',
          onComplete: () => {
            this.scene.start('MainMenuScene');
          }
        });
      }
    };

    btn.addEventListener('mousedown', handleHold);
    btn.addEventListener('touchstart', handleHold);

    this.events.once('shutdown', () => {
      btn.removeEventListener('mousedown', handleHold);
      btn.removeEventListener('touchstart', handleHold);
    });
  }
}
