import Settings from "../data/Settings";
import Button from "./Button";

class Modal extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, btnFirstTexture: string, btnSecondTexture: string) {
    const { centerX, centerY } = scene.cameras.main;
    super(scene, centerX, centerY, 'modal')
    this._scene = scene
    this._btnFirstTexture = btnFirstTexture
    this._btnSecondTexture = btnSecondTexture
    this._build()
  }

  private _scene: Phaser.Scene
  private _btnFirstTexture: string
  private _btnSecondTexture: string

  public btnFirst: Button
  public btnSecond: Button
  public btnMusic: Button

  private _build(): void {
    this._scene.add.existing(this)
    this.setDisplaySize(this.width, this.height - 73)
    this.setDepth(10);

    const { centerX } = this._scene.cameras.main;

    this.btnFirst = new Button(this._scene, centerX, this.getBounds().top + 60, this._btnFirstTexture).setDepth(10)

    this.btnSecond = new Button(this._scene, centerX, this.btnFirst.getBounds().bottom + 60, this._btnSecondTexture).setDepth(10)

    const btnMusicTexture = Settings.sounds.getVolume() === 1 ? 'button-music-unmute' : 'button-music-mute'
    this.btnMusic = new Button(this._scene, this.getBounds().left + 60, this.getBounds().bottom - 60, btnMusicTexture).setDepth(10)
    this.btnMusic.callback = (): void => {
      if (Settings.sounds.getVolume() === 1) {
        Settings.sounds.mute()
        this.btnMusic.setTexture('button-music-mute')
      } else {
        Settings.sounds.unmute()
        this.btnMusic.setTexture('button-music-unmute')
      }
    }

  }

  public setTextBtn(btn: 'first' | 'second', text: string): void {
    if (btn === 'first') {
      this.btnFirst.text = this._scene.add.text(this.btnFirst.x, this.btnFirst.y, (text).toUpperCase(), {
        color: 'white',
        font: '36px EpilepsySans'
      }).setOrigin(.5, .6).setDepth(11);
    } else {
      this.btnSecond.text = this._scene.add.text(this.btnSecond.x, this.btnSecond.y, (text).toUpperCase(), {
        color: 'white',
        font: '36px EpilepsySans',
      }).setOrigin(.5, .6).setDepth(11);
    }
  }

  public destroyAll(): void {
    this.destroy()
    this.btnFirst.destroy()
    this.btnSecond.destroy()
    this.btnMusic.destroy()
  }
}

export default Modal