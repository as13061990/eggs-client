import Session from "../data/Session";
import Settings from "../data/Settings";
import Game from "../scenes/Game";
import UI from "../scenes/UI";
import { eggType, eggPosition, boosterType } from "../types/enums";


const PLATFORM_MARGIN_X = 40
const PLATFORM_MARGIN_Y = 60
const DURATION_FIRST_ANIMATION = 3000
const DURATION_SECOND_ANIMATION = 1500
const DURATION_SMASHE_EGG_ANIMATION = 2000

class Egg extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game, position: eggPosition, type: eggType = eggType.default) {
    const { x, y } = Egg._checkForStartPosition(position, scene)
    super(scene, x, y, type);
    this._scene = scene;
    this._type = type
    this._position = position
    this._build();
  }

  private _scene: Game;
  private _position: eggPosition
  private _reverse: 1 | -1
  private _tween: Phaser.Tweens.Tween = null
  private _type: eggType
  private _isScaleTweenTime: boolean = false
  public danger: boolean = true

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.eggs.add(this);
    this._startFirstAnimation()
  }

  private _startFirstAnimation(): void {
    let x: number, y: number
    switch (this._position) {
      case eggPosition.LEFT_UP:
        x = this._scene.actions.woodElements.leftUp.getBounds().right + PLATFORM_MARGIN_X
        y = this._scene.actions.woodElements.leftUp.getBounds().bottom - PLATFORM_MARGIN_Y
        this._reverse = 1
        break;
      case eggPosition.LEFT_DOWN:
        x = this._scene.actions.woodElements.leftDown.getBounds().right + PLATFORM_MARGIN_X
        y = this._scene.actions.woodElements.leftDown.getBounds().bottom - PLATFORM_MARGIN_Y
        this._reverse = 1
        break;
      case eggPosition.RIGHT_UP:
        x = this._scene.actions.woodElements.rightUp.getBounds().left - PLATFORM_MARGIN_X
        y = this._scene.actions.woodElements.rightUp.getBounds().bottom - PLATFORM_MARGIN_Y
        this._reverse = -1
        break;
      case eggPosition.RIGHT_DOWN:
        x = this._scene.actions.woodElements.rightDown.getBounds().left - PLATFORM_MARGIN_X
        y = this._scene.actions.woodElements.rightDown.getBounds().bottom - PLATFORM_MARGIN_Y
        this._reverse = -1
        break;
    }

    const boost = Session.getActiveBooster(boosterType.good) ? 1.5 : 1
    if (boost === 1.5) this._isScaleTweenTime = true

    this._tween = this._scene.tweens.add({
      targets: this,
      rotation: 4 * Math.PI * this._reverse,
      x: { value: x },
      y: { value: y },
      duration: DURATION_FIRST_ANIMATION * boost,
      onComplete: this._startSecondAnimation.bind(this)
    });
  }

  private _startSecondAnimation(): void {
    const duration =
      this._position === eggPosition.LEFT_DOWN || this._position === eggPosition.RIGHT_DOWN
        ? DURATION_SECOND_ANIMATION / 2.5 : DURATION_SECOND_ANIMATION
    const turnovers =
      this._position === eggPosition.LEFT_DOWN || this._position === eggPosition.RIGHT_DOWN
        ? 1 : 2

    const boost = Session.getActiveBooster(boosterType.good) ? 1.5 : 1
    if (boost === 1.5) this._isScaleTweenTime = true

    this._tween = this._scene.tweens.add({
      targets: this,
      rotation: turnovers * Math.PI * this._reverse,
      x: { value: this.x },
      y: { value: this._scene.scale.height - 100 },
      duration: duration * boost,
      onComplete: this._destroyUncaughtEgg.bind(this)
    });

  }

  private _destroyUncaughtEgg(): void {
    const { x, y } = this

    this.destroy()
    if (this.danger && this._type !== eggType.bomb && this._type !== eggType.bad) {
      Session.minusHealth()
    }

    let sprite
    if (this._type === eggType.good) {
      sprite = this._scene.add.sprite(x, y, 'egg-good')
      sprite.setRotation(0.40)
      Settings.sounds.play('egg-smash')
    } else if (this._type === eggType.heal) {
      sprite = this._scene.add.sprite(x, y, 'egg-heal-smash')
      Settings.sounds.play('egg-heal-smash')
    } else if (this._type === eggType.bomb) {
      sprite = this._scene.add.sprite(x, y, 'egg-bomb-smash')
      sprite.anims.play('egg-bomb-smash', true)
      Settings.sounds.play('egg-bomb-smash')
    } else if (this._type === eggType.bad) {
      sprite = this._scene.add.sprite(x, y, 'egg-bad')
      sprite.setRotation(0.40)
      Settings.sounds.play('egg-smash')
    } else {
      Settings.sounds.play('egg-smash')
      sprite = this._scene.add.sprite(x, y, 'egg-smash')
    }

    this._tween = this._scene.tweens.add({
      targets: sprite,
      alpha: 0,
      duration: DURATION_SMASHE_EGG_ANIMATION,
      onComplete: () => sprite.destroy()
    });
  }

  private static _checkForStartPosition(position: eggPosition, scene: Game): { x: number, y: number } {
    switch (position) {
      case eggPosition.LEFT_UP:
        return {
          x: scene.actions.woodElements.leftUp.getBounds().left,
          y: scene.actions.woodElements.leftUp.getBounds().top
        };
      case eggPosition.LEFT_DOWN:
        return {
          x: scene.actions.woodElements.leftDown.getBounds().left,
          y: scene.actions.woodElements.leftDown.getBounds().top
        };
      case eggPosition.RIGHT_UP:
        return {
          x: scene.actions.woodElements.rightUp.getBounds().right,
          y: scene.actions.woodElements.rightUp.getBounds().top
        };
      case eggPosition.RIGHT_DOWN:
        return {
          x: scene.actions.woodElements.rightDown.getBounds().right,
          y: scene.actions.woodElements.rightDown.getBounds().top
        };
    }
  }

  public stopTween(): void {
    this._tween.stop()
  }

  public scaleTweenTime(): void {
    if (!this._isScaleTweenTime) {
      this._isScaleTweenTime = true
      this._tween.setTimeScale(0.68)
    }
  }

  public resetScaleTweenTime(): void {
    this._isScaleTweenTime = false
    this._tween.setTimeScale(1.49)
  }

  public getType(): eggType {
    return this._type
  }
}

export default Egg;