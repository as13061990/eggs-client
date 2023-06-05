import Session from "../data/Session"
import Settings from "../data/Settings"
import UI from "../scenes/UI"

const MARGIN_BETWEEN = 40
class HealthBar extends Phaser.GameObjects.Text {
  constructor(scene: UI, x: number, y: number) {
    super(scene, 0, 0, Session.getHealth().toString(), {})
    this._scene = scene
    this._healthFirst = this._scene.add.sprite(x, y, 'health-full')
    this._build()
  }

  private _scene: UI

  private _healthFirst: Phaser.GameObjects.Sprite
  private _healthSecond: Phaser.GameObjects.Sprite
  private _healthThird: Phaser.GameObjects.Sprite

  private _build(): void {
    this._healthSecond = this._scene.add.sprite(this._healthFirst.getBounds().right + MARGIN_BETWEEN, this._healthFirst.y, 'health-full')
    this._healthThird = this._scene.add.sprite(this._healthSecond.getBounds().right + MARGIN_BETWEEN, this._healthFirst.y, 'health-full')
    this._scene.add.existing(this);
    this.setVisible(false)
  }

  protected preUpdate(time: number, delta: number): void {
    if (this.text !== Session.getHealth().toString()) {
      switch (Session.getHealth()) {
        case 0:
          this.setText(Session.getHealth().toString())
          this._healthFirst.setTexture('health-empty')
          this._healthSecond.setTexture('health-empty')
          this._healthThird.setTexture('health-empty')
          this._scene.actions.gameOver()
          break;
        case 1:
          this.setText(Session.getHealth().toString())
          this._healthFirst.setTexture('health-full')
          this._healthSecond.setTexture('health-empty')
          this._healthThird.setTexture('health-empty')
          break;
        case 2:
          this.setText(Session.getHealth().toString())
          this._healthFirst.setTexture('health-full')
          this._healthSecond.setTexture('health-full')
          this._healthThird.setTexture('health-empty')
          break;
        case 3:
          this.setText(Session.getHealth().toString())
          this._healthFirst.setTexture('health-full')
          this._healthSecond.setTexture('health-full')
          this._healthThird.setTexture('health-full')
          break;
      }
    }
  }

}

export default HealthBar