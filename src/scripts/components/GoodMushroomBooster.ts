import Session from "../data/Session";
import Game from "../scenes/Game";
import UI from "../scenes/UI";
import { eggType } from "../types/enums";

class GoodMushroomBooster extends Phaser.GameObjects.Sprite {
  constructor(scene: UI) {
    super(scene, 0, 0, 'egg-good')
    this._scene = scene
    this._build()
  }

  private _scene: UI
  private _text: Phaser.GameObjects.Text
  private _type: eggType = eggType.good

  private _build(): void {
    this._scene.add.existing(this);
    this._text = this._scene.add.text(0, 0, Session.getBoostTimer(this._type).toString(), { font: '64px EpilepsySansBold', color: 'white' })

    this.setVisible(false)
    this._text.setVisible(false)
  }

  protected preUpdate(time: number, delta: number): void {
    if (!this.visible && Session.getBoostTimer(this._type) > 0 && Session.getActiveBooster(this._type)) {
      console.log('asd')
      let countActive = 0
      if (Session.getActiveBooster(eggType.bad)) countActive++
      if (Session.getActiveBooster(eggType.score)) countActive++

      const { centerX } = this._scene.cameras.main;
      this.setPosition(centerX, this._scene.score.getBounds().centerY + (70 * countActive))
      this._text.setPosition(this.getBounds().right + 10, this.getBounds().top)

      this.setVisible(true)
      this._text.setVisible(true)
    }
    if (this.visible && this._text.text !== Session.getBoostTimer(this._type).toString()) {
      this._text.setText(Session.getBoostTimer(this._type).toString())
    }
    if (this.visible && Session.getBoostTimer(this._type) === 0) {
      this.setVisible(false)
      this._text.setVisible(false)
    }
  }
}

export default GoodMushroomBooster