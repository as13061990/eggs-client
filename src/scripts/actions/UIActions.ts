import Button from "../components/Button";
import Egg from "../components/Egg";
import HealthBar from "../components/HealthBar";
import Modal from "../components/Modal";
import Session from "../data/Session";
import Settings from "../data/Settings";
import Game from "../scenes/Game";
import UI from "../scenes/UI";
import Rating from "../screen/Rating";
import RewardLifeAd from "../screen/RewardLifeAd";
import { boosterType, screen } from "../types/enums";
import Ads from "./Ads";
import User from "../data/User";
import Zone from "../components/Zone";
import Api from "../data/Api";
import GoodBooster from "../components/GoodBooster";
import Score from "../components/Score";
import ScoreBooster from "../components/ScoreBooster";
import BadBooster from "../components/BadBooster";

interface IPauseElements {
  bg: Phaser.GameObjects.TileSprite
  modal: Modal
}

class UIActions {
  constructor(scene: UI) {
    this._scene = scene;
  }

  private _scene: UI;
  private _pauseMobileBtn: Button
  private _pauseElements: IPauseElements = { bg: null, modal: null }
  private _activeScreen: Rating = null
  public health: HealthBar

  public build(): void {
    this._createMobilePauseButton()
    this._createScore()
    this._createHealth()
    this._createTutorial()
    this._createBoosters()
  }

  public gamePause(): void {
    if (Session.getOver()) return;
    if (this._activeScreen) {
      this._activeScreen.back()
      return
    }
    const { width, height } = this._scene.cameras.main;

    if (!Settings.getIsPaused()) {
      Settings.setIsPaused(true)
      this._pauseMobileBtn.setTexture('resume')
      this._pauseMobileBtn.disableInteractive();
      this._pauseElements.bg = this._scene.add.tileSprite(0, 0, width, height, 'black-pixel').setAlpha(.5).setOrigin(0, 0).setDepth(5)
      this._pauseElements.modal = new Modal(this._scene, 'button-green-def', 'button-red-def', true)

      this._pauseElements.modal.setTextBtn('first', 'Продолжить')
      this._pauseElements.modal.setTextBtn('second', 'Выход')

      this._pauseElements.modal.btnFirst.callback = (): void => this.pauseClose()
      this._pauseElements.modal.btnSecond.callback = (): void => this._exit()
      if (this._pauseElements.modal.btnRating) {
        this._pauseElements.modal.btnRating.callback = (): void => this._rating()
      }

      const sceneGame = this._scene.game.scene.getScene('Game') as Game;
      sceneGame.scene.pause()
    } else {
      this.pauseClose()
    }
  }

  public pauseClose(): void {
    Settings.setIsPaused(false)

    this._pauseMobileBtn.setInteractive()
    this._pauseMobileBtn.setTexture('pause')

    const sceneGame = this._scene.game.scene.getScene('Game') as Game;
    sceneGame.scene.resume()

    this._pauseElements.modal.destroyAll()
    this._pauseElements.bg.destroy()
  }

  private _exit(): void {
    Session.clear()
    this._scene.scene.start('Menu');
    Settings.setScreen(screen.MAIN);
    Settings.setIsPaused(false)
  }

  private _restart(): void {
    const sceneGame = this._scene.game.scene.getScene('Game') as Game;
    Session.clear()
    this._scene.scene.stop()
    sceneGame.scene.restart()
  }

  public gameOver(): void {
    if (Session.getOver()) return;
    Session.setOver(true);

    let countActive = 0
    if (Session.getActiveBooster(boosterType.bad)) countActive++
    if (Session.getActiveBooster(boosterType.score)) countActive++
    if (Session.getActiveBooster(boosterType.good)) countActive++

    if (countActive > 0) {
      Settings.sounds.stopMusic()
      Settings.sounds.playMusic('bg')
    }

    const { width, height } = this._scene.cameras.main;

    Api.postRating()
    if (User.getScore() < Session.getPoints()) {
      User.setScore(Session.getPoints());
    }
    this._pauseMobileBtn.disableInteractive();
    this._pauseElements.bg = this._scene.add.tileSprite(0, 0, width, height, 'black-pixel').setAlpha(.5).setOrigin(0, 0).setDepth(5);

    this._pauseElements.modal = new Modal(this._scene, 'button-green-def', 'button-red-def', true)

    this._pauseElements.modal.setTextBtn('first', 'Рестарт')
    this._pauseElements.modal.setTextBtn('second', 'Выход')

    const sceneGame = this._scene.game.scene.getScene('Game') as Game;
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

    this._rewardLifeAd()
  }

  public activeInteractiveBtns(): void {
    this._pauseElements?.modal?.btnFirst?.setInteractive();
    this._pauseElements?.modal?.btnSecond?.setInteractive();
    this._pauseElements?.modal?.btnRating?.setInteractive();
    this._pauseElements?.modal?.btnMusic?.setInteractive();
    this._pauseMobileBtn?.setInteractive()
  }

  private _rewardLifeAd(): void {
    if (Ads.getReadyAd() && Session.getWatchedAds() > 0) {
      new RewardLifeAd(this._scene, true);
      this._pauseElements?.modal?.btnFirst?.disableInteractive();
      this._pauseElements?.modal?.btnSecond?.disableInteractive();
      this._pauseElements?.modal?.btnRating?.disableInteractive();
      this._pauseElements?.modal?.btnMusic?.disableInteractive();
      this._pauseMobileBtn?.disableInteractive()
    }
  }

  private _rating(): void {
    this._activeScreen = new Rating(this._scene, true);
    this._pauseElements?.modal?.btnFirst?.disableInteractive();
    this._pauseElements?.modal?.btnSecond?.disableInteractive();
    this._pauseElements?.modal?.btnRating?.disableInteractive();
    this._pauseElements?.modal?.btnMusic?.disableInteractive();
    this._pauseMobileBtn?.disableInteractive()
  }

  private _createScore(): void {
    this._scene.score = new Score(this._scene)
  }

  private _createHealth(): void {
    this.health = new HealthBar(this._scene, this._scene.scale.width - 450, 80)
  }

  private _createBoosters(): void {
    this._scene.goodEggBoost = new GoodBooster(this._scene)
    this._scene.scoreEggBoost = new ScoreBooster(this._scene)
    this._scene.badEggBoost = new BadBooster(this._scene)
  }


  private _createMobilePauseButton(): void {
    this._pauseMobileBtn = new Button(this._scene, this._scene.scale.width - 150, 80, 'pause').setDepth(5)
    this._pauseMobileBtn.callback = (): void => {
      this.gamePause()
    }
  }

  private _createTutorial(): void {
    if (!Settings.getTutorial()) return
    const sceneGame = this._scene.game.scene.getScene('Game') as Game;
    sceneGame.scene.pause()
    Session.setOver(true)
    const elements = []
    const { centerX, centerY, width, height } = sceneGame.cameras.main;
    const bg = this._scene.add.tileSprite(0, 0, width, height, 'black-pixel').setAlpha(.5).setOrigin(0, 0).setDepth(5);
    const text = Settings.isMobile() ? 'Нажимай на зоны на экране, \n чтобы передвигаться и ловить яйца'
      : 'Нажимай на кнопки, \n чтобы передвигаться и ловить яйца'

    const title = this._scene.add.text(centerX, centerY, (text).toUpperCase(), {
      align: 'center',
      color: 'black',
      font: '48px EpilepsySansBold',
    }).setOrigin(.5, .5).setDepth(21);

    const modal = this._scene.add.sprite(centerX, centerY, 'modal')
      .setOrigin(.5, .5).setDepth(20).setDisplaySize(title.width + 70, title.height + 150)

    const closeTutorialZone = new Zone(this._scene, centerX, centerY, width, height).setDepth(5)

    elements.push(title, modal, bg, closeTutorialZone)
    if (Settings.isMobile()) {

      const leftUpZone = this._scene.add.sprite(centerX / 2 + 7, height / 4 + 7, 'modal-full')
        .setDisplaySize(width / 2 - 50, height / 2 - 50)
        .setOrigin(0.5, 0.5)
        .setAlpha(0.3)
        .setDepth(5)


      const leftUpZoneText = this._scene.add.text(leftUpZone.getBounds().centerX, leftUpZone.getBounds().centerY, ('Сюда').toUpperCase(), {
        align: 'center',
        color: '#1e1112',
        font: '48px EpilepsySansBold',
      }).setOrigin(.5, .5).setDepth(21);

      const leftDownZone = this._scene.add.sprite(centerX / 2 + 7, height / 2 + 18, 'modal-full')
        .setDisplaySize(width / 2 - 50, height / 2 - 50)
        .setOrigin(0.5, 0)
        .setAlpha(0.3)
        .setDepth(5)

      const leftDownZoneText = this._scene.add.text(leftDownZone.getBounds().centerX, leftDownZone.getBounds().centerY, ('Сюда').toUpperCase(), {
        align: 'center',
        color: '#1e1112',
        font: '48px EpilepsySansBold',
      }).setOrigin(.5, .5).setDepth(21);

      const rightUpZone = this._scene.add.sprite(centerX * 1.5 - 7, height / 4 + 7, 'modal-full')
        .setDisplaySize(width / 2 - 50, height / 2 - 50)
        .setOrigin(0.5, 0.5)
        .setAlpha(0.3)
        .setDepth(5)

      const rightUpZoneText = this._scene.add.text(rightUpZone.getBounds().centerX, rightUpZone.getBounds().centerY, ('Сюда').toUpperCase(), {
        align: 'center',
        color: '#1e1112',
        font: '48px EpilepsySansBold',
      }).setOrigin(.5, .5).setDepth(21);

      const rightDownZone = this._scene.add.sprite(centerX * 1.5 - 7, height / 2 + 18, 'modal-full')
        .setDisplaySize(width / 2 - 50, height / 2 - 50)
        .setOrigin(0.5, 0)
        .setAlpha(0.3)
        .setDepth(5)

      const rightDownZoneText = this._scene.add.text(rightDownZone.getBounds().centerX, rightDownZone.getBounds().centerY, ('Сюда').toUpperCase(), {
        align: 'center',
        color: '#1e1112',
        font: '48px EpilepsySansBold',
      }).setOrigin(.5, .5).setDepth(21);


      elements.push(leftUpZone, leftUpZoneText, leftDownZone, leftDownZoneText, rightDownZone, rightDownZoneText, rightUpZone, rightUpZoneText)

      this._scene.add.tween({
        targets: [title, leftUpZoneText, leftDownZoneText, rightDownZoneText, rightUpZoneText],
        duration: 600,
        scaleX: 1.05,
        scaleY: 1.05,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          elements.forEach(el => {
            el.destroy()
          })
          closeTutorialZone.destroy()
          sceneGame.scene.resume()
          Session.setOver(false)
          Settings.setTutorial(false)
        }
      })
    } else {
      title.setOrigin(0.5, 0.95)
      const closeText = this._scene.add.text(centerX, centerY + 70, ("Нажми ПКМ по экрану, чтобы закрыть").toUpperCase(), {
        align: 'center',
        color: 'black',
        font: '36px EpilepsySans',
      }).setOrigin(.5, .5).setDepth(21);
      const modaBtns = this._scene.add.sprite(centerX, modal.getBounds().bottom + 200, 'modal')
        .setOrigin(.5, .5).setDepth(20).setDisplaySize(title.width + 60, title.height + 160)
      const imgArrow = this._scene.add.sprite(centerX + 200, modaBtns.getBounds().centerY, 'keyboard-arrows').setDepth(20)
      const imgWasd = this._scene.add.sprite(centerX - 200, modaBtns.getBounds().centerY, 'keyboard-wasd').setDepth(20)
      elements.push(modaBtns, imgArrow, imgWasd, closeText)
      this._scene.add.tween({
        targets: [title, closeText, imgArrow, imgWasd],
        duration: 600,
        scaleX: 1.05,
        scaleY: 1.05,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          elements.forEach(el => {
            el.destroy()
          })
          closeTutorialZone.destroy()
          sceneGame.scene.resume()
          Session.setOver(false)
          Settings.setTutorial(false)
        }
      })
    }





    closeTutorialZone.clickCallback = (): void => {
      elements.forEach(el => {
        el.destroy()
      })
      closeTutorialZone.destroy()
      sceneGame.scene.resume()
      Session.setOver(false)
      Settings.setTutorial(false)
    }
  }

  public setActiveScreen(screen: Rating) {
    this._activeScreen = screen
  }



}

export default UIActions;