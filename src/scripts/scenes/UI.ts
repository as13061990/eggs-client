import axios from "axios";
import Button from "../components/Button";
import HealthBar from "../components/HealthBar";
import Modal from "../components/Modal";
import Session from "../data/Session";
import Settings from "../data/Settings";
import { platforms, screen } from "../types/enums";
import Game from "./Game";
import User from "../data/User";
import Rating from "../screen/Rating";
import RewardLifeAd from "../screen/RewardLifeAd";

interface IPauseElements {
  bg: Phaser.GameObjects.TileSprite
  modal: Modal
}


class UI extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  private _pauseMobileBtn: Button
  private _pauseElements: IPauseElements = { bg: null, modal: null }
  private _activeScreen: Rating = null
  public score: Phaser.GameObjects.Text
  public health: HealthBar


  public gamePause(): void {
    if (Session.getOver()) return;
    if (this._activeScreen) {
      this._activeScreen.back()
      return
    }
    const { width, height } = this.cameras.main;

    if (!Settings.getIsPaused()) {
      Settings.setIsPaused(true)

      this._pauseElements.bg = this.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0).setDepth(5)
      this._pauseElements.modal = new Modal(this, 'button-green-def', 'button-red-def', true)

      this._pauseElements.modal.setTextBtn('first', 'Продолжить')
      this._pauseElements.modal.setTextBtn('second', 'Выход')

      this._pauseElements.modal.btnFirst.callback = (): void => this._pauseClose()
      this._pauseElements.modal.btnSecond.callback = (): void => this._exit()
      this._pauseElements.modal.btnRating.callback = (): void => this._rating()

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

    this._pauseElements.bg = this.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0).setDepth(5);
    
    this._pauseElements.modal = new Modal(this, 'button-green-def', 'button-red-def', true)
    
    this._pauseElements.modal.setTextBtn('first', 'Рестарт')
    this._pauseElements.modal.setTextBtn('second', 'Выход')
    
    const sceneGame = this.game.scene.getScene('Game') as Game;
    sceneGame.scene.pause()
    
    this._pauseElements.modal.btnFirst.callback = (): void => this._restart()
    this._pauseElements.modal.btnSecond.callback = (): void => this._exit()
    this._pauseElements.modal.btnRating.callback = (): void => this._rating()
    
    this._rewardLifeAd()
  }
  
  public activeInteractiveBtns(): void {
    this._pauseElements.modal.btnFirst.setInteractive();
    this._pauseElements.modal.btnSecond.setInteractive();
    this._pauseElements.modal.btnRating.setInteractive();
    this._pauseElements.modal.btnMusic.setInteractive();
    this._pauseMobileBtn.setInteractive()
  }

  private _rewardLifeAd(): void {
    new RewardLifeAd(this, true);
    this._pauseElements.modal.btnFirst.disableInteractive();
    this._pauseElements.modal.btnSecond.disableInteractive();
    this._pauseElements.modal.btnRating.disableInteractive();
    this._pauseElements.modal.btnMusic.disableInteractive();
    this._pauseMobileBtn.disableInteractive()
  }

  private _rating(): void {
    this._activeScreen = new Rating(this, true);
    this._pauseElements.modal.btnFirst.disableInteractive();
    this._pauseElements.modal.btnSecond.disableInteractive();
    this._pauseElements.modal.btnRating.disableInteractive();
    this._pauseElements.modal.btnMusic.disableInteractive();
    this._pauseMobileBtn.disableInteractive()
  }

  public createScore(): void {
    this.score = this.add.text(68, 80, Session.getPoints().toString(), { font: '48px EpilepsySans', color: 'yellow  ' }).setDepth(6)
  }

  public createHealth(): void {
    this.health = new HealthBar(this, this.scale.width - 450, 80)
  }


  public createMobilePauseButton(): void {
    this._pauseMobileBtn = new Button(this, this.scale.width - 150, 80, 'button-blue-press').setDepth(5)
    this._pauseMobileBtn.setDisplaySize(150, this._pauseMobileBtn.height)
    this._pauseMobileBtn.text = this.add.text(this._pauseMobileBtn.x, this._pauseMobileBtn.y, ('Пауза').toUpperCase(), {
      color: 'white',
      font: '36px EpilepsySans',
    }).setOrigin(.5, .5).setDepth(5)

    this._pauseMobileBtn.callback = (): void => {
      this.gamePause()
    }
  }

  private _postRating(id: number | string): void {
    axios.post(process.env.API + '/rating/post', {
      platform: Settings.getPlatform(),
      id: id,
      score: Session.getPoints(),
    })
  }

  public setActiveScreen(screen: Rating) {
    this._activeScreen = screen
  }
}

export default UI;