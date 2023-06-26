import Session from "../data/Session";
import UI from "../scenes/UI";
import { eggType } from "../types/enums";

class BoosterInfo extends Phaser.GameObjects.Text {
  constructor(scene: UI) {
    super(scene, 0, 0, '', { font: '64px EpilepsySansBold', color: 'white' })
    this._scene = scene
    this._build()
  }

  private _scene: UI
  private _type: eggType = null
  private _animation: Phaser.Tweens.Tween = null

  private _build(): void {
    this._scene.add.existing(this);
    this.setOrigin(0.5, 0.5)
    this.setDepth(4)
  }

  private _startAnimation(): void {
    this._animation = this._scene.add.tween({
      targets: this,
      duration: 600,
      scaleX: 1.08,
      scaleY: 1.08,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        this.setText('')
        this._animation = null
        Session.setTakenBooster(null)
        this._type = null
      }
    })
  }

  protected preUpdate(time: number, delta: number): void {
    if (this._type !== Session.getTakenBooster() && Session.getTakenBooster() !== null) {

      if (this._animation) this._animation?.stop()

      this._type = Session.getTakenBooster()
      const position = Session.getPosition()

      const { centerX, } = this._scene.cameras.main;
      this.setPosition(centerX, this._scene.score.getBounds().centerY + (75 * position))

      if (this._type === eggType.gold) {
        this.setText('Золотое яйцо собрало все яйца!')
      } else if (this._type === eggType.good) {
        this.setText('Этот гриб все замедлил!')
      } else if (this._type === eggType.heal) {
        this.setText('Дополнительная жизнь! Супер!')
      } else if (this._type === eggType.bomb) {
        this.setText('Яйца сделали бум!')
      } else if (this._type === eggType.score) {
        this.setText('О да! Двойные очки!')
      } else if (this._type === eggType.bad) {
        this.setText('О нет! Этот гриб делает плохо!')
      }

      this._startAnimation()
    }
  }
}

export default BoosterInfo