import Button from "../components/Button";
import Text from "../components/Text";
import Session from "../data/Session";
import Settings from "../data/Settings";
import { screen } from "../types/enums";
import Game from "./Game";

interface IPauseElements {
  bg: Phaser.GameObjects.TileSprite
  btnResume: Button
  btnExit: Button
  btnMusic: Button
  modal: Phaser.GameObjects.Sprite
}


class UI extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  private _pauseElements: IPauseElements = { bg: null, btnResume: null, btnExit: null, modal: null, btnMusic: null }
  public score: Phaser.GameObjects.Text
  public health: Phaser.GameObjects.Text

  public gamePause(): void {
    if (Session.getOver()) return;

    const { width, height, centerX, centerY } = this.cameras.main;

    if (!Settings.getIsPaused()) {
      Settings.setIsPaused(true)

      this._pauseElements.modal = this.add.sprite(centerX, centerY, 'modal').setDepth(10);

      this._pauseElements.bg = this.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0)
      this._pauseElements.btnResume = new Button(this, centerX, this._pauseElements.modal.getBounds().top + 60, 'button-green-def').setDepth(10)
      this._pauseElements.btnResume.text = this.add.text(this._pauseElements.btnResume.x, this._pauseElements.btnResume.y, ('Продолжить').toUpperCase(), {
        color: 'white',
        fontSize: 32,
        fontStyle: 'bold'
      }).setOrigin(.5, .5).setDepth(11);


      const btnMusicTexture = Settings.sounds.getVolume() === 1 ? 'button-music-unmute' : 'button-music-mute'
      this._pauseElements.btnMusic = new Button(this, this._pauseElements.modal.getBounds().left + 60, this._pauseElements.modal.getBounds().bottom - 60, btnMusicTexture).setDepth(10)
      this._pauseElements.btnMusic.callback = (): void => {
        if (Settings.sounds.getVolume() === 1) {
          Settings.sounds.mute()
          this._pauseElements.btnMusic.setTexture('button-music-mute')
        } else {
          Settings.sounds.unmute()
          this._pauseElements.btnMusic.setTexture('button-music-unmute')
        }
      }

      this._pauseElements.btnExit = new Button(this, centerX, this._pauseElements.btnResume.getBounds().bottom + 60, 'button-red-def').setDepth(10)
      this._pauseElements.btnExit.text = this.add.text(this._pauseElements.btnExit.x, this._pauseElements.btnExit.y, ('Выход').toUpperCase(), {
        color: 'white',
        fontSize: 32,
        fontStyle: 'bold'
      }).setOrigin(.5, .5).setDepth(11);

      const sceneGame = this.game.scene.getScene('Game') as Game;
      sceneGame.scene.pause()

      this._pauseElements.btnResume.callback = (): void => {
        this._pauseClose()
      };

      this._pauseElements.btnExit.callback = (): void => {
        this._exit()
      };

    } else {
      this._pauseClose()
    }
  }

  private _pauseClose(): void {
    Settings.setIsPaused(false)

    const sceneGame = this.game.scene.getScene('Game') as Game;

    sceneGame.scene.resume()
    Object.values(this._pauseElements).forEach(el => {
      el.destroy()
    })
  }

  private _exit(): void {
    Session.clear()
    this.scene.start('Menu');
    Settings.setScreen(screen.MAIN);
    Settings.setIsPaused(false)
  }

  public gameOver(): void {
    if (Session.getOver()) return;
    Session.setOver(true);

    const { width, height, centerX, centerY } = this.cameras.main;

    this.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0);

    const modal = this.add.sprite(centerX, centerY, 'modal').setDepth(10);

    const restartBtn = new Button(this, centerX, modal.getBounds().top + 60, 'button-green-def').setDepth(10)
    restartBtn.text = this.add.text(restartBtn.x, restartBtn.y, ('Рестарт').toUpperCase(), {
      color: 'white',
      fontSize: 32,
      fontStyle: 'bold'
    }).setOrigin(.5, .5).setDepth(11);

    const exitBtn = new Button(this, centerX, restartBtn.getBounds().bottom + 60, 'button-red-def').setDepth(10)
    exitBtn.text = this.add.text(exitBtn.x, exitBtn.y, ('Выход').toUpperCase(), {
      color: 'white',
      fontSize: 32,
      fontStyle: 'bold'
    }).setOrigin(.5, .5).setDepth(11);

    const btnMusicTexture = Settings.sounds.getVolume() === 1 ? 'button-music-unmute' : 'button-music-mute'
    this._pauseElements.btnMusic = new Button(this, this._pauseElements.modal.getBounds().left + 60, this._pauseElements.modal.getBounds().bottom - 60, btnMusicTexture).setDepth(10)
    this._pauseElements.btnMusic.callback = (): void => {
      if (Settings.sounds.getVolume() === 1) {
        Settings.sounds.mute()
        this._pauseElements.btnMusic.setTexture('button-music-mute')
      } else {
        Settings.sounds.unmute()
        this._pauseElements.btnMusic.setTexture('button-music-unmute')
      }
    }

    const sceneGame = this.game.scene.getScene('Game') as Game;
    sceneGame.scene.pause()

    restartBtn.callback = (): void => {
      Session.clear()
      this.scene.stop()
      sceneGame.scene.restart()
    }

    exitBtn.callback = (): void => {
      this._exit()
    }
  }

  public createScore(): void {
    this.score = this.add.text(68, 80, Session.getPoints().toString(), { fontSize: 44, color: 'black' }).setDepth(6)
  }

  public createHealth(): void {
    this.health = this.add.text(this.scale.width - 70, 80, Session.getHealth().toString(), { fontSize: 44, color: 'black' }).setDepth(6)
  }


  public createMobilePauseButton(): void {
    const pauseBtn = new Button(this, 100, 180, 'button-blue-press').setDepth(10)
    pauseBtn.setDisplaySize(150, pauseBtn.height)
    pauseBtn.text = this.add.text(pauseBtn.x, pauseBtn.y, ('Пауза').toUpperCase(), {
      color: 'white',
      fontSize: 32,
      fontStyle: 'bold'
    }).setOrigin(.5, .5).setDepth(11)

    pauseBtn.callback = (): void => {
      this.gamePause()
    }
  }
}

export default UI;