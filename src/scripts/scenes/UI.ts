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
import Ads from "../actions/Ads";
import Egg from "../components/Egg";
import Zone from "../components/Zone";
import { Scene } from "phaser";

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
      this._pauseMobileBtn.setTexture('resume')


      this._pauseElements.bg = this.add.tileSprite(0, 0, width, height, 'red-pixel').setAlpha(.5).setOrigin(0, 0).setDepth(5)
      this._pauseElements.modal = new Modal(this, 'button-green-def', 'button-red-def', true)

      this._pauseElements.modal.setTextBtn('first', 'Продолжить')
      this._pauseElements.modal.setTextBtn('second', 'Выход')

      this._pauseElements.modal.btnFirst.callback = (): void => this.pauseClose()
      this._pauseElements.modal.btnSecond.callback = (): void => this._exit()
      if (this._pauseElements.modal.btnRating) {
        this._pauseElements.modal.btnRating.callback = (): void => this._rating()
      }

      const sceneGame = this.game.scene.getScene('Game') as Game;
      sceneGame.scene.pause()
    } else {
      this.pauseClose()
    }
  }

  public pauseClose(): void {
    Settings.setIsPaused(false)

    this._pauseMobileBtn.setTexture('pause')

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
    sceneGame.physics.world.bodies.iterate((body: any): any => {
      if (body.gameObject instanceof Egg) {
        body.gameObject.danger = false
      }
    })
    sceneGame.scene.pause()

    this._pauseElements.modal.btnFirst.callback = (): void => this._restart()
    this._pauseElements.modal.btnSecond.callback = (): void => this._exit()
    if (this._pauseElements.modal.btnRating) {
      this._pauseElements.modal.btnRating.callback = (): void => this._rating()
    }

    this._postRating()
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

    if (Ads.getReadyAd() && Session.getWatchedAds() > 0) {
      new RewardLifeAd(this, true);
      this._pauseElements.modal.btnFirst.disableInteractive();
      this._pauseElements.modal.btnSecond.disableInteractive();
      this._pauseElements.modal.btnRating.disableInteractive();
      this._pauseElements.modal.btnMusic.disableInteractive();
      this._pauseMobileBtn.disableInteractive()
    }
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
    this._pauseMobileBtn = new Button(this, this.scale.width - 150, 80, 'pause').setDepth(5)
    this._pauseMobileBtn.callback = (): void => {
      this.gamePause()
    }
  }

  private _postRating(): void {
    if (Settings.getPlatform() !== platforms.WEB) {
      axios.post(process.env.API + '/rating/post', {
        platform: Settings.getPlatform(),
        id: User.getID(),
        score: Session.getPoints(),
      })
    }
  }

  public creatTutorial(): void {
    const sceneGame = this.game.scene.getScene('Game') as Game;
    sceneGame.scene.pause()
    const elements = []
    const { centerX, centerY, width, height } = sceneGame.cameras.main;

    const text = Settings.isMobile() ? 'Нажимай на зоны на экране, \n чтобы передвигаться и ловить яйца'
      : 'Нажимай на кнопки, \n чтобы передвигаться и ловить яйца'

    const title = this.add.text(centerX, centerY, (text).toUpperCase(), {
      align: 'center',
      color: 'black',
      font: '48px EpilepsySansBold',
    }).setOrigin(.5, .5).setDepth(21);

    const modal = this.add.sprite(centerX, centerY, 'modal')
      .setOrigin(.5, .5).setDepth(20).setDisplaySize(title.width + 50, title.height + 100)

    elements.push(title, modal)
    if (Settings.isMobile()) {

      const leftUpZone = this.add.sprite(centerX / 2, height / 4, 'modal')
        .setDisplaySize(width / 2, height / 2)
        .setAlpha(0.3)
        .setDepth(5)

      const leftUpZoneText = this.add.text(leftUpZone.getBounds().centerX, leftUpZone.getBounds().centerY, ('Сюда').toUpperCase(), {
        align: 'center',
        color: '#1e1112',
        font: '48px EpilepsySansBold',
      }).setOrigin(.5, .5).setDepth(21);

      const leftDownZone = this.add.sprite(centerX / 2, leftUpZone.getBounds().bottom * 1.5, 'modal')
        .setDisplaySize(width / 2, height / 2)
        .setAlpha(0.3)
        .setDepth(5)

      const leftDownZoneText = this.add.text(leftDownZone.getBounds().centerX, leftDownZone.getBounds().centerY, ('Сюда').toUpperCase(), {
        align: 'center',
        color: '#1e1112',
        font: '48px EpilepsySansBold',
      }).setOrigin(.5, .5).setDepth(21);

      const rightUpZone = this.add.sprite(centerX * 1.5, height / 4, 'modal')
        .setDisplaySize(width / 2, height / 2)
        .setAlpha(0.3)
        .setDepth(5)

      const rightUpZoneText = this.add.text(rightUpZone.getBounds().centerX, rightUpZone.getBounds().centerY, ('Сюда').toUpperCase(), {
        align: 'center',
        color: '#1e1112',
        font: '48px EpilepsySansBold',
      }).setOrigin(.5, .5).setDepth(21);

      const rightDownZone = this.add.sprite(centerX * 1.5, rightUpZone.getBounds().bottom * 1.5, 'modal')
        .setDisplaySize(width / 2, height / 2)
        .setAlpha(0.3)
        .setDepth(5);

      const rightDownZoneText = this.add.text(rightDownZone.getBounds().centerX, rightDownZone.getBounds().centerY, ('Сюда').toUpperCase(), {
        align: 'center',
        color: '#1e1112',
        font: '48px EpilepsySansBold',
      }).setOrigin(.5, .5).setDepth(21);


      elements.push(leftUpZone, leftUpZoneText, leftDownZone, leftDownZoneText, rightDownZone, rightDownZoneText, rightUpZone, rightUpZoneText)
    } else {
      const closeText = this.add.text(centerX, centerY + 70, ("Нажми ПКМ по экрану, чтобы закрыть").toUpperCase(), {
        align: 'center',
        color: 'black',
        font: '36px EpilepsySans',
      }).setOrigin(.5, .5).setDepth(21);
      const modaBtns = this.add.sprite(centerX, modal.getBounds().bottom + 200, 'modal')
      .setOrigin(.5, .5).setDepth(20).setDisplaySize(title.width + 50, title.height + 150)
      const imgArrow = this.add.sprite(centerX + 200, modaBtns.getBounds().centerY, 'keyboard-arrows').setDepth(20)
      const imgWasd = this.add.sprite(centerX - 200, modaBtns.getBounds().centerY, 'keyboard-wasd').setDepth(20)
      elements.push(modaBtns, imgArrow, imgWasd, closeText)
    }

    const closeTutorialZone = new Zone(this, centerX, centerY, width, height).setDepth(5)
    closeTutorialZone.clickCallback = (): void => {
      elements.forEach(el => {
        el.destroy()
      })
      closeTutorialZone.destroy()
      sceneGame.scene.resume()
    }
  }

  public setActiveScreen(screen: Rating) {
    this._activeScreen = screen
  }
}

export default UI;