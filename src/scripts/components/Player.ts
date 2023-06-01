import Settings from '../data/Settings';
import Game from '../scenes/Game';

const MARGIN_X = 150
const MARGIN_X_PLAYER_SPRITE = 330
const MARGIN_Y_PLAYER_SPRITE = 100
const ANIMATION_DURATION = Settings.isMobile() ? 100 : 200

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(
      scene,
      scene.actions.woodElements.leftDown.getBounds().right + MARGIN_X,
      scene.actions.woodElements.leftDown.getBounds().bottom,
      'basket'
    )
    this._scene = scene
    this._build()
  }

  private isMoving: boolean = false;
  private _flyAnimation: Phaser.Tweens.Tween
  private _scene: Game;
  private _sprite: Phaser.GameObjects.Sprite

  private _build(): void {

    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNumbers('wizzard', { start: 0, end: 5 }),
      frameRate: 5,
      repeat: -1
    });
    const { centerX } = this._scene.cameras.main;
    this._sprite = this._scene.add.sprite(centerX, this._scene.scale.height - MARGIN_Y_PLAYER_SPRITE, 'wizzard')
    this._sprite.flipX = true
    this._sprite.setOrigin(0.5, 1)
    this._sprite.setDisplaySize(this._sprite.width * 8, this._sprite.height * 8)
    this.setBodySize(280, 250)
    this.setDepth(12)
    this._sprite.anims.play('idle', true)
    this._flyAnimation = this._scene.tweens.add({
      targets: this,
      yoyo: true,
      y: '+=10',
      duration: 600,
      repeat: -1,
    });
  }

  private _startFlyAnimation(): void {
    this._flyAnimation = this._scene.tweens.add({
      targets: this,
      yoyo: true,
      y: '+=10',
      duration: 600,
      repeat: -1,
    });
  }

  private _stopFlyAnimation(): void {
    this._flyAnimation.remove()
  }

  public right(): void {
    if (!this.isMoving) {
      this._stopFlyAnimation()
      this.isMoving = true;
      const { centerY } = this._scene.cameras.main;
      if (this.y > centerY) {
        this.setPosition(this.x, this._scene.actions.woodElements.leftDown.getBounds().bottom)
      } else {
        this.setPosition(this.x, this._scene.actions.woodElements.leftUp.getBounds().bottom)
      }
      this._scene.tweens.add({
        targets: this,
        x: { value: this._scene.actions.woodElements.rightDown.getBounds().left - MARGIN_X },
        y: { value: this.y },
        duration: ANIMATION_DURATION,
        onComplete: () => {
          this.isMoving = false;
          this._startFlyAnimation()
        }
      });
      // this.setPosition(this._scene.actions.woodElements.rightDown.getBounds().left - MARGIN_X, this.y)
      this._sprite.flipX = false
    }
  }

  public left(): void {
    if (!this.isMoving) {
      this._stopFlyAnimation()
      this.isMoving = true;
      const { centerY } = this._scene.cameras.main;
      if (this.y > centerY) {
        this.setPosition(this.x, this._scene.actions.woodElements.leftDown.getBounds().bottom)
      } else {
        this.setPosition(this.x, this._scene.actions.woodElements.leftUp.getBounds().bottom)
      }
      this._scene.tweens.add({
        targets: this,
        x: { value: this._scene.actions.woodElements.leftDown.getBounds().right + MARGIN_X },
        y: { value: this.y },
        duration: ANIMATION_DURATION,
        onComplete: () => {
          this.isMoving = false;
          this._startFlyAnimation()
        }
      });

      this._sprite.flipX = true
    }
  }

  public down(): void {
    if (!this.isMoving) {
      this._stopFlyAnimation()
      this.isMoving = true;
      this._scene.tweens.add({
        targets: this,
        x: { value: this.x },
        y: { value: this._scene.actions.woodElements.leftDown.getBounds().bottom },
        duration: ANIMATION_DURATION,
        onComplete: () => {
          this.isMoving = false;
          this._startFlyAnimation()
        }
      });
    }
    // this.setPosition(this.x, this._scene.actions.woodElements.leftDown.getBounds().bottom)
  }

  public up(): void {
    if (!this.isMoving) {
      this._stopFlyAnimation()
      this.isMoving = true;
      this._scene.tweens.add({
        targets: this,
        x: { value: this.x },
        y: { value: this._scene.actions.woodElements.leftUp.getBounds().bottom },
        duration: ANIMATION_DURATION,
        onComplete: () => {
          this.isMoving = false;
          this._startFlyAnimation()
        }
      });
    }
    // this.setPosition(this.x, this._scene.actions.woodElements.leftUp.getBounds().bottom)
  }

  public leftUp(): void {
    if (!this.isMoving) {
      this._stopFlyAnimation()
      this.isMoving = true;
      this._scene.tweens.add({
        targets: this,
        x: { value: this._scene.actions.woodElements.leftUp.getBounds().right + MARGIN_X },
        y: { value: this._scene.actions.woodElements.leftUp.getBounds().bottom },
        duration: ANIMATION_DURATION,
        onComplete: () => {
          this.isMoving = false;
          this._startFlyAnimation()
        }
      });
      this._sprite.flipX = true
    }
  }

  public leftDown(): void {
    if (!this.isMoving) {
      this._stopFlyAnimation()
      this.isMoving = true;
      this._scene.tweens.add({
        targets: this,
        x: { value: this._scene.actions.woodElements.leftDown.getBounds().right + MARGIN_X },
        y: { value: this._scene.actions.woodElements.leftDown.getBounds().bottom },
        duration: ANIMATION_DURATION,
        onComplete: () => {
          this.isMoving = false;
          this._startFlyAnimation()
        }
      });
      this._sprite.flipX = true
    }
  }

  public rightUp(): void {
    if (!this.isMoving) {
      this._stopFlyAnimation()
      this.isMoving = true;
      this._scene.tweens.add({
        targets: this,
        x: { value: this._scene.actions.woodElements.rightUp.getBounds().left - MARGIN_X },
        y: { value: this._scene.actions.woodElements.rightUp.getBounds().bottom },
        duration: ANIMATION_DURATION,
        onComplete: () => {
          this.isMoving = false;
          this._startFlyAnimation()
        }
      });
      this._sprite.flipX = false
    }
  }

  public rightDown(): void {
    if (!this.isMoving) {
      this._stopFlyAnimation()
      this.isMoving = true;
      this._scene.tweens.add({
        targets: this,
        x: { value: this._scene.actions.woodElements.rightDown.getBounds().left - MARGIN_X },
        y: { value: this._scene.actions.woodElements.rightDown.getBounds().bottom },
        duration: ANIMATION_DURATION,
        onComplete: () => {
          this.isMoving = false;
          this._startFlyAnimation()
        }
      });
      this._sprite.flipX = false
    }
  }
}

export default Player;