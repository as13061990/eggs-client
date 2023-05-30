import Settings from "../data/Settings";
import User from "../data/User";
import Rating from "../screen/Rating";
import { platforms, screen } from "../types/enums";
import Button from "./Button";

class Modal extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, btnFirstTexture: string, btnSecondTexture: string, btnRating?: boolean) {
    const { centerX, centerY } = scene.cameras.main;
    super(scene, centerX, centerY, 'modal')
    this._scene = scene
    this._btnFirstTexture = btnFirstTexture
    this._btnSecondTexture = btnSecondTexture
    this._btnRating = btnRating
    this._build()
  }

  private _scene: Phaser.Scene
  private _btnFirstTexture: string
  private _btnSecondTexture: string
  private _btnRating: boolean = false
  private _modalScore: Phaser.GameObjects.Sprite
  private _web: boolean = Settings.getPlatform() === platforms.WEB

  public btnFirst: Button = null
  public btnRating: Button = null
  public btnSecond: Button = null
  public btnMusic: Button = null
  public score:  Phaser.GameObjects.Text

  private _build(): void {
    this._scene.add.existing(this)
    const { centerX } = this._scene.cameras.main;

    this.setDisplaySize(this.width, this.height - 73)
    if (this._btnRating) this.setDisplaySize(this.width, this.height + 30)
    if (this._web) this.setDisplaySize(this.width, this.height - 180)
    if (this._web && this._btnRating) this.setDisplaySize(this.width, this.height - 73)

    this.setDepth(10);


    this.btnFirst = new Button(this._scene, centerX, this.getBounds().top + 60, this._btnFirstTexture).setDepth(10)


    if (this._btnRating && !this._web) {
      this.btnRating = new Button(this._scene, centerX, this.btnFirst.getBounds().bottom + 60, 'button-blue-def').setDepth(10)
      this.btnRating.text = this._scene.add.text(this.btnRating.x, this.btnRating.y, ('Рейтинг').toUpperCase(), {
        color: 'white',
        font: '36px EpilepsySans'
      }).setOrigin(.5, .6).setDepth(11);
      this.btnSecond = new Button(this._scene, centerX, this.btnRating.getBounds().bottom + 60, this._btnSecondTexture).setDepth(10)
    } else {
      if (!this._web || (this._web && this._btnSecondTexture !== 'button-blue-def')) {
        this.btnSecond = new Button(this._scene, centerX, this.btnFirst.getBounds().bottom + 60, this._btnSecondTexture).setDepth(10)
      }
    }


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
    this._modalScore =  this._scene.add.sprite(centerX, this.getBounds().top - 80, 'modal')
    .setOrigin(.5, .5).setDepth(11).setDisplaySize(this.width, 105)

    this.score =  this._scene.add.text(this._modalScore.getBounds().centerX, this._modalScore.getBounds().centerY, `Ваш рекорд \n ${User.getScore().toString()}`, {
      color: 'black',
      align: 'center',
      font: '36px EpilepsySansBold'
    } ).setDepth(11).setOrigin(0.5, 0.5);
  }



  public setTextBtn(btn: 'first' | 'second', text: string): void {
    if (btn === 'first') {
      this.btnFirst.text = this._scene.add.text(this.btnFirst.x, this.btnFirst.y, (text).toUpperCase(), {
        color: 'white',
        font: '36px EpilepsySans'
      }).setOrigin(.5, .6).setDepth(11);
    } else {
      if (!this._web || (this._web && this._btnSecondTexture !== 'button-blue-def')) {
        this.btnSecond.text = this._scene.add.text(this.btnSecond.x, this.btnSecond.y, (text).toUpperCase(), {
          color: 'white',
          font: '36px EpilepsySans',
        }).setOrigin(.5, .6).setDepth(11);
      }
    }
  }

  public destroyAll(): void {
    this.destroy()
    this.btnFirst.destroy()
    if (this.btnFirst) {
      this.btnSecond.destroy()
    }
    this.btnMusic.destroy()
    if (this.btnRating) {
      this.btnRating.destroy()
    }
    this._modalScore.destroy()
    this.score.destroy()
  }
}

export default Modal