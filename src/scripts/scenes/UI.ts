import Button from "../components/Button";
import Modal from "../components/Modal";
import Text from "../components/Text";
import Session from "../data/Session";
import Settings from "../data/Settings";
import { screen } from "../types/enums";
import Game from "./Game";

interface IPauseElements {
  bg: Phaser.GameObjects.TileSprite
  modal: Modal
}


class UI extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  private _pauseElements: IPauseElements = { bg: null, modal: null }
  public score: Phaser.GameObjects.Text
  public health: Phaser.GameObjects.Text

  public gamePause(): void {
    if (Session.getOver()) return;

    const { width, height, centerX, centerY } = this.cameras.main;

    if (!Settings.getIsPaused()) {
      Settings.setIsPaused(true)
      
      this._pauseElements.bg = this.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0)
      this._pauseElements.modal = new Modal(this, 'button-green-def', 'button-blue-def')

      this._pauseElements.modal.setTextBtn('first', 'Продолжить')
      this._pauseElements.modal.setTextBtn('second', 'Выход')
  
      this._pauseElements.modal.btnFirst.callback = (): void => this._pauseClose()
      this._pauseElements.modal.btnSecond.callback = (): void => this._exit()

      const sceneGame = this.game.scene.getScene('Game') as Game;
      sceneGame.scene.pause()
    } else {
      this._pauseClose()
    }
  }

  private _pauseClose(): void {
    Settings.setIsPaused(false)

    const sceneGame = this.game.scene.getScene('Game') as Game;
    sceneGame.scene.resume()

    this._pauseElements.modal.destroyAll()
    this._pauseElements.bg.destroy()
  }

  private _exit(): void {
    Session.clear()
    this.scene.start('Menu');
    Settings.setScreen(screen.MAIN);
    Settings.setIsPaused(false)
  }

  private _restart(): void {
    const sceneGame = this.game.scene.getScene('Game') as Game;
    Session.clear()
    this.scene.stop()
    sceneGame.scene.restart()
  }

  public gameOver(): void {
    if (Session.getOver()) return;
    Session.setOver(true);

    const { width, height } = this.cameras.main;

    this.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0);

    const modal = new Modal(this, 'button-green-def', 'button-blue-def')

    modal.setTextBtn('first', 'Рестарт')
    modal.setTextBtn('second', 'Выход')

    const sceneGame = this.game.scene.getScene('Game') as Game;
    sceneGame.scene.pause()
    
    modal.btnFirst.callback = (): void => this._restart()
    modal.btnSecond.callback = (): void => this._exit()
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