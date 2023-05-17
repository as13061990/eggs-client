import Button from "../components/Button";
import Text from "../components/Text";
import Session from "../data/Session";
import Settings from "../data/Settings";
import { screen } from "../types/enums";
import Game from "./Game";

interface IPauseElements {
  bg: Phaser.GameObjects.TileSprite
  text: Text
  btnResume: Button
  btnExit: Button
}


class UI extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  private _pauseElements: IPauseElements = { bg: null, text: null, btnResume: null, btnExit: null }


  public gamePause(): void {

    const { width, height, centerX, centerY } = this.cameras.main;

    if (!Settings.getIsPaused()) {
      Settings.setIsPaused(true)

      this._pauseElements.bg = this.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0)
      this._pauseElements.text = new Text(this, 'ПАУЗА', { x: centerX, y: centerY - 200, fontSize: 44 })
      this._pauseElements.btnResume = new Button(this, centerX, centerY - 100, 'button').setDepth(10)
      this._pauseElements.btnResume.text = this.add.text(this._pauseElements.btnResume.x, this._pauseElements.btnResume.y, ('Продолжить').toUpperCase(), {
        color: '#000000',
        fontSize: 32,
      }).setOrigin(.5, .5).setDepth(11);

      this._pauseElements.btnExit = new Button(this, centerX, centerY, 'button').setDepth(10)
      this._pauseElements.btnExit.text = this.add.text(this._pauseElements.btnExit.x, this._pauseElements.btnExit.y, ('Выход').toUpperCase(), {
        color: '#000000',
        fontSize: 32,
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

    this._pauseElements.bg.destroy()
    this._pauseElements.btnResume.destroy()
    this._pauseElements.btnExit.destroy()
    this._pauseElements.text.destroy()
  }

  private _exit(): void {
    Session.clear()
    this.scene.start('Menu');
    Settings.setScreen(screen.MAIN);
    Settings.setIsPaused(false)
  }


  public createMobilePauseButton(): void {
    const pauseBtn = new Button(this, 100, 150, 'button').setDepth(10)
    pauseBtn.setDisplaySize(60, 40)
    pauseBtn.text = this.add.text(pauseBtn.x, pauseBtn.y, ('Пауза').toUpperCase(), {
      color: '#000000',
      fontSize: 14,
    }).setOrigin(.5, .5).setDepth(11)

    pauseBtn.callback = (): void => {
      this.gamePause()
    }
  }
}

export default UI;