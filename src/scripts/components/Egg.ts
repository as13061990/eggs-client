import Session from "../data/Session";
import Settings from "../data/Settings";
import Game from "../scenes/Game";
import UI from "../scenes/UI";
import { eggPosition } from "../types/enums";


const PLATFORM_MARGIN_X = 40
const PLATFORM_MARGIN_Y = 60

const DURATION_FIRST_ANIMATION = 3000
const DURATION_SECOND_ANIMATION = 1500
const DURATION_SMASHE_EGG_ANIMATION = 2000

class Egg extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game, type: eggPosition) {
    const { x, y } = Egg._checkForStartPosition(type, scene)
    super(scene, x, y, 'egg');
    this._scene = scene;
    this._type = type
    this._build();
  }

  private _scene: Game;
  private _type: eggPosition
  private _reverse: 1 | -1
  private _tween: Phaser.Tweens.Tween = null
  public danger: boolean = true

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.eggs.add(this);
    this._startFirstAnimation()
  }

  private _startFirstAnimation(): void {
    let x: number, y: number
    switch (this._type) {
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
    this._tween = this._scene.tweens.add({
      targets: this,
      rotation: 4 * Math.PI * this._reverse,
      x: { value: x },
      y: { value: y },
      duration: DURATION_FIRST_ANIMATION,
      onComplete: this._startSecondAnimation.bind(this)
    });
  }

  private _startSecondAnimation(): void {
    const duration =
      this._type === eggPosition.LEFT_DOWN || this._type === eggPosition.RIGHT_DOWN
        ? DURATION_SECOND_ANIMATION / 2.5 : DURATION_SECOND_ANIMATION
    const turnovers =
      this._type === eggPosition.LEFT_DOWN || this._type === eggPosition.RIGHT_DOWN
        ? 1 : 2
    this._tween = this._scene.tweens.add({
      targets: this,
      rotation: turnovers * Math.PI * this._reverse,
      x: { value: this.x },
      y: { value: this._scene.scale.height - 100 },
      duration: duration,
      onComplete: this._destroyUncaughtEgg.bind(this)
    });

  }

  private _destroyUncaughtEgg(): void {
    const sceneUI = this._scene.game.scene.getScene('UI') as UI;
    Settings.sounds.play('egg-smash')
    const { x, y } = this

    this.destroy()
    if (this.danger) {
      Session.minusHealth()
      sceneUI.actions.health.minusHealth()
      
    }

    const eggSmash = this._scene.add.sprite(x, y, 'egg-smash')
    this._tween = this._scene.tweens.add({
      targets: eggSmash,
      alpha: 0,
      duration: DURATION_SMASHE_EGG_ANIMATION,
      onComplete: () => eggSmash.destroy()
    });

    if (Session.getHealth() === 0) {
      sceneUI.actions.gameOver()
    }

  }

  private static _checkForStartPosition(type: eggPosition, scene: Game): { x: number, y: number } {
    switch (type) {
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
}

export default Egg;