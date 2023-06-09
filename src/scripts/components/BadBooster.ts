import Session from "../data/Session";
import Settings from "../data/Settings";
import Game from "../scenes/Game";
import UI from "../scenes/UI";
import { boosterType } from "../types/enums";
import Egg from "./Egg";

class BadBooster extends Phaser.GameObjects.Sprite {
  constructor(scene: UI) {
    super(scene, 0, 0, 'egg-bad')
    this._scene = scene
    this._build()
  }

  private _scene: UI
  private _text: Phaser.GameObjects.Text
  private _type: boosterType = boosterType.bad
  private _bg: Phaser.GameObjects.TileSprite
  private _position: number = 0

  private _build(): void {
    this._scene.add.existing(this);
    this._text = this._scene.add.text(0, 0, Session.getBoostTimer(this._type).toString(), { font: '64px EpilepsySansBold', color: 'white' })
    .setDepth(4)
    this.setDepth(4)
    this.setVisible(false)
    this._text.setVisible(false)
    const { centerX, width, height  } = this._scene.cameras.main;
  }

  protected preUpdate(time: number, delta: number): void {
    if (!this.visible && Session.getBoostTimer(this._type) > 0 && Session.getActiveBooster(this._type)) {
     
      this._position = Session.setPosition()

      const { centerX, width, height  } = this._scene.cameras.main;
      this.setPosition(centerX, this._scene.score.getBounds().centerY + (75 * this._position))
      this._text.setPosition(this.getBounds().right + 10, this.getBounds().top)

      this.setVisible(true)
      this._text.setVisible(true)

      Settings.sounds.stopMusic()
      Settings.sounds.playMusic('egg-bad')

      this._bg = this._scene.add.tileSprite(0, 0, width, height, 'green-pixel').setAlpha(.7).setOrigin(0, 0).setDepth(3);
    }
    if (this.visible && this._text.text !== Session.getBoostTimer(this._type).toString()) {
      this._text.setText(Session.getBoostTimer(this._type).toString())
    }
    if (this.visible && Session.getBoostTimer(this._type) === 0) {
      Session.setActiveBooster(false, this._type)

      this.setVisible(false)
      this._text.setVisible(false)
      this._bg.destroy()

      Session.clearPosition(this._position)
      this._position = 0

      let countActive = 0
      if (Session.getActiveBooster(boosterType.good)) countActive++
      if (Session.getActiveBooster(boosterType.score)) countActive++

      Settings.sounds.stopMusic()
      if (countActive > 0) {
        Settings.sounds.playMusic('egg-good')
      } else {
        Settings.sounds.playMusic('bg')
      }
    }
  }
}

export default BadBooster