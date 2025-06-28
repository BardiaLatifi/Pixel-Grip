export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
    this.optionButtonHeld = false;
  }

  preload() {
    this.load.spritesheet('background', 'assets/main-menu/background-sheet.png', {
      frameWidth: 640,
      frameHeight: 360
    });

    // Optionally load a click sound or menu move sound here
  }

  create() {
    // === Add Images ===
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const phaserLogo = this.add.image(centerX, centerY, 'phaser-logo').setOrigin(0.5).setAlpha(0);
    this.pgLogo = this.add.image(centerX, centerY, 'pixelgrip-logo').setOrigin(0.5).setAlpha(0);
    const slogan = this.add.image(centerX, centerY, 'slogan').setOrigin(0.5).setAlpha(0);
    this.pressPrompt = this.add.image(centerX, centerY, 'press-option').setOrigin(0.5).setAlpha(0);

    // === Step 1: Fade in Phaser logo ===
    this.tweens.add({
      targets: phaserLogo,
      alpha: 1,
      duration: 1000,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          // === Step 2: Fade out Phaser logo ===
          this.tweens.add({
            targets: phaserLogo,
            alpha: 0,
            duration: 1000,
            ease: 'Sine.easeOut',
            onComplete: () => {
              // === Step 3: Fade in your logo ===
              this.tweens.add({
                targets: this.pgLogo,
                alpha: 1,
                duration: 1500,
                ease: 'Sine.easeIn',
              });

              // === Step 4: Fade in slogan ===
              this.time.delayedCall(1500, () => {
                this.tweens.add({
                  targets: slogan,
                  alpha: 1,
                  duration: 1500,
                  ease: 'Sine.easeIn',
                  onComplete: () => {
                    // === Step 5: Hold slogan, then fade out ===
                    this.time.delayedCall(2000, () => {
                      this.tweens.add({
                        targets: slogan,
                        alpha: 0,
                        duration: 1500,
                        ease: 'Sine.easeOut',
                        onComplete: () => {
                          // === Step 6: Show press prompt ===
                          this.tweens.add({
                            targets: this.pressPrompt,
                            alpha: 1,
                            duration: 500,
                            ease: 'Sine.easeIn',
                            onComplete: () => {
                              this.startBlinking(this.pressPrompt);
                              this.enableOptionButton();
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
      target.setAlpha(1);
    }
  }

  enableOptionButton() {
    const btn = document.getElementById('option-btn');
    if (!btn) return;

    const handleHold = () => {
      if (!this.optionButtonHeld) {
        this.optionButtonHeld = true;

        this.stopBlinking(this.pressPrompt);

        // === Step 7: Fade out prompt ===
        this.tweens.add({
          targets: this.pressPrompt,
          alpha: 0,
          duration: 500,
          ease: 'Sine.easeOut',
          onComplete: () => {
            // === Step 8: Fade out logo ===
            this.tweens.add({
              targets: this.pgLogo,
              alpha: 0,
              duration: 800,
              ease: 'Sine.easeOut',
              onComplete: () => {
                this.time.delayedCall(100, () => {
                  this.scene.start('MainMenuScene');
                });
              }
            });
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
