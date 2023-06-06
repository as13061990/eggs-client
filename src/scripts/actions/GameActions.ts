import Egg from '../components/Egg';
import Player from '../components/Player';
import Wood from '../components/Wood';
import Zone from '../components/Zone';
import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';
import UI from '../scenes/UI';
import { boosterType, eggType } from '../types/enums';

const PIXEL_FROM_WOOD_EDGES = 100
const WOOD_ROTATE = 0.46
const DELAY_EGG_SPAWN = 800

class GameActions {
  constructor(scene: Game) {
    this._scene = scene;
  }

  public woodElements: IwoodElements = {
    leftUp: null,
    leftDown: null,
    rightUp: null,
    rightDown: null,
  }

  private _scene: Game;

  public build(): void {
    this._createUI()

    this._controls()

    this._createWoodElements()
    this._createPlayer()
    this._anims()

    this._collisions()

    this._createEggsGroup()
  }

  private _createUI(): void {
    const { width, height } = this._scene.cameras.main;
    const background = this._scene.add.sprite(width / 2, height, `bg-${Session.getBg()}`);
    background.setOrigin(0.5, 1);

    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);
  }

  private _createWoodElements(): void {
    const { centerY, width, height } = this._scene.cameras.main;
    this.woodElements.leftDown = new Wood(this._scene, PIXEL_FROM_WOOD_EDGES, height / 1.7).setRotation(WOOD_ROTATE)
    this.woodElements.leftUp = new Wood(this._scene, PIXEL_FROM_WOOD_EDGES, height / 4.5).setRotation(WOOD_ROTATE)
    this.woodElements.rightDown = new Wood(this._scene, width - PIXEL_FROM_WOOD_EDGES, height / 1.7).setRotation(-WOOD_ROTATE)
    this.woodElements.rightUp = new Wood(this._scene, width - PIXEL_FROM_WOOD_EDGES, height / 4.5).setRotation(-WOOD_ROTATE)
  }

  private _anims(): void {
    this._scene.anims.create({
      key: 'egg-bomb-smash',
      frames: this._scene.anims.generateFrameNumbers('egg-bomb-smash', { start: 0, end: 11 }),
      frameRate: 9,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'egg-explosion',
      frames: this._scene.anims.generateFrameNumbers('egg-explosion', { start: 0, end: 7 }),
      frameRate: 9,
      repeat: 0,
    });
  }

  private _createPlayer(): void {
    this._scene.player = new Player(this._scene)
  }

  private _collisions(): void {
    this._scene.physics.add.collider(
      this._scene.eggs,
      this._scene.player,
      this._eggsPlayer.bind(this)
    );
  }

  private _eggsPlayer(player: Player, egg: Egg): void {
    if (egg.getType() === eggType.gold) {
      this._catchGoldenEgg(egg)
    } else if (egg.getType() === eggType.default) {
      this._catchDefaultEgg(egg)
    } else if (egg.getType() === eggType.good) {
      this._catchGoodEgg(egg)
    } else if (egg.getType() === eggType.heal) {
      this._catchHealEgg(egg)
    } else if (egg.getType() === eggType.bomb) {
      this._catchBombEgg(egg)
    } else if (egg.getType() === eggType.score) {
      this._catchScoreEgg(egg)
    } else if (egg.getType() === eggType.bad) {
      this._catchBadEgg(egg)
    }
  }

  private _catchDefaultEgg(egg: Egg): void {
    egg.destroy()
    egg.stopTween()
    Session.plusPoints(1)
    Settings.sounds.play('egg-catch')
  }

  private _catchGoodEgg(egg: Egg): void {
    egg.destroy()
    egg.stopTween()
    Session.plusPoints(1)
    Settings.sounds.play('egg-booster')
    Session.setActiveBooster(true, boosterType.good)
    this._scene.eggs.getChildren().forEach((egg: Egg) => {
      egg.scaleTweenTime()
    });
  }

  private _catchGoldenEgg(eggGold: Egg): void {
    const sceneUI = this._scene.game.scene.getScene('UI') as UI;
    eggGold.destroy()
    eggGold.stopTween()
    Session.plusPoints(1)
    Settings.sounds.play('egg-booster')
    this._scene.eggs.getChildren().forEach((egg: Egg) => {
      egg.stopTween()
      this._scene.tweens.add({
        targets: egg,
        x: sceneUI.score.getBounds().centerX,
        y: sceneUI.score.getBounds().centerY,
        duration: 1000,
        onComplete: this._caughtEggsByGoldenEgg.bind(this, egg)
      });
    })
  }

  private _caughtEggsByGoldenEgg(egg: Egg): void {
    if (egg.getType() === eggType.good) {
      this._catchGoodEgg(egg)
    } else if (egg.getType() === eggType.heal) {
      this._catchHealEgg(egg)
    } else if (egg.getType() === eggType.bomb) {
      this._catchBombEgg(egg)
    } else if (egg.getType() === eggType.score) {
      this._catchScoreEgg(egg)
    } else if (egg.getType() === eggType.bad) {
      this._catchBadEgg(egg)
    } else {
      egg.destroy()
      Session.plusPoints(1)
    }
  }

  private _catchHealEgg(egg: Egg): void {
    egg.destroy()
    egg.stopTween()
    Session.plusPoints(1)
    Settings.sounds.play('heal')
    Session.plusHealth()
  }

  private _catchBombEgg(egg: Egg): void {
    egg.destroy()
    egg.stopTween()
    Session.plusPoints(1)
    Settings.sounds.play('egg-bomb-smash')
    this._scene.physics.world.bodies.iterate((body: any): any => {
      if (body.gameObject instanceof Egg) {
        body.gameObject.explosion()
      }
    })
  }

  private _catchScoreEgg(egg: Egg): void {
    egg.destroy()
    egg.stopTween()
    Session.plusPoints(1)
    Settings.sounds.play('egg-booster')
    Session.setActiveBooster(true, boosterType.score)
  }

  private _catchBadEgg(egg: Egg): void {
    egg.destroy()
    egg.stopTween()
    Session.plusPoints(1)
    Settings.sounds.play('egg-booster')
    Session.setActiveBooster(true, boosterType.bad)
  }

  private _createEggsGroup(): void {
    const delay = Session.getDifficulty() * 1000
    this._scene.time.addEvent({
      delay: delay, callback: (): void => {
        this._spawnEgg()
        this._createEggsGroup()
      }
      , loop: false
    });
  }



  private _generateTypeEgg(): eggType {
    if (Phaser.Math.RND.frac() < 0.25) {
      const randomNumber = Phaser.Math.RND.frac()
      const isBadBoost = Session.getActiveBooster(boosterType.bad)
      const isGoodBoost = Session.getActiveBooster(boosterType.good)
      if (randomNumber <= 0.1 && !isBadBoost) {
        return eggType.gold
      } else if (randomNumber > 0.1 && randomNumber <= 0.2 && !isBadBoost) {
        return eggType.good
      } else if (randomNumber > 0.2 && randomNumber <= 0.3 && !isBadBoost) {
        return eggType.heal
      } else if (randomNumber > 0.3 && randomNumber <= 0.4 && !isGoodBoost) {
        return eggType.bomb
      } else if (randomNumber > 0.4 && randomNumber <= 0.5 && !isBadBoost) {
        return eggType.score
      } else if (randomNumber > 0.5 && randomNumber <= 0.6 && !isGoodBoost) {
        return eggType.bad
      }
    } else {
      return eggType.default
    }
  }

  private _spawnEgg(): void {
    const diff = Session.getDifficulty()
    if (diff > 1.7) {
      const randomNumber = Phaser.Math.Between(0, 3);
      const type = this._generateTypeEgg()
      new Egg(this._scene, randomNumber, type)
    } else if (diff <= 1.7 && diff >= 0.8) {
      const randomNumber = Phaser.Math.Between(0, 3);
      const type = this._generateTypeEgg()
      new Egg(this._scene, randomNumber, type)
      this._scene.time.addEvent({
        delay: 300, callback: (): void => {
          new Egg(this._scene, Math.abs(randomNumber - 2))
        }
        , loop: false
      });
    } else if (diff < 0.8) {
      const randomNumber = Phaser.Math.Between(0, 3);
      const type = this._generateTypeEgg()
      new Egg(this._scene, randomNumber, type)
      this._scene.time.addEvent({
        delay: 300, callback: (): void => {
          new Egg(this._scene, Math.abs(randomNumber - 3))
        }
        , loop: false
      });
    }
  }

  private _controls(): void {
    const sceneUI = this._scene.game.scene.getScene('UI') as UI;
    sceneUI.input.keyboard.on('keydown-ESC', () => { sceneUI.actions.gamePause(); console.log('s') }, sceneUI)

    if (Settings.isMobile()) {
      this._controlsMobile()
    } else {
      this._controlsPC()
    }
  }


  private _controlsPC(): void {
    const cursors = this._scene.input.keyboard.createCursorKeys();

    this._scene.input.keyboard.on('keydown-A', () => {
      Settings.sounds.play('keyboard')
      this._scene.player.left()
    }, this)
    this._scene.input.keyboard.on('keydown-D', () => {
      Settings.sounds.play('keyboard')
      this._scene.player.right()
    }, this)
    this._scene.input.keyboard.on('keydown-W', () => {
      Settings.sounds.play('keyboard')
      this._scene.player.up()
    }, this)
    this._scene.input.keyboard.on('keydown-S', () => {
      Settings.sounds.play('keyboard')
      this._scene.player.down()
    }, this)


    cursors.left.on('down', (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.left()
    });
    cursors.right.on('down', (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.right()
    });
    cursors.down.on('down', (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.down()
    });
    cursors.up.on('down', (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.up()
    });
  }

  private _controlsMobile(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;

    let clickedLeftUp = false
    const leftUpZone = new Zone(this._scene, centerX / 2, height / 4, width / 2, height / 2).setDepth(5)
    leftUpZone.clickCallback = (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.leftUp()

      if (!clickedLeftUp) {
        const leftDownZoneAnim = this._scene.add.sprite(centerX / 2 + 7, height / 4 + 7, 'modal-full')
          .setDisplaySize(width / 2 - 50, height / 2 - 50)
          .setOrigin(0.5, 0.5)
          .setAlpha(0.6)
          .setDepth(5)
        clickedLeftUp = true
        this._scene.tweens.add({
          targets: leftDownZoneAnim,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            clickedLeftUp = false
            leftDownZoneAnim.destroy()
          }
        });
      }
    }

    let clickedLeftDown = false
    const leftDownZone = new Zone(this._scene, centerX / 2, leftUpZone.getBounds().bottom * 1.5, width / 2, height / 2).setDepth(5)
    leftDownZone.clickCallback = (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.leftDown()

      if (!clickedLeftDown) {
        const leftDownZoneAnim = this._scene.add.sprite(centerX / 2 + 7, height / 2 + 18, 'modal-full')
          .setDisplaySize(width / 2 - 50, height / 2 - 50)
          .setOrigin(0.5, 0)
          .setAlpha(0.6)
          .setDepth(5)
        clickedLeftDown = true
        this._scene.tweens.add({
          targets: leftDownZoneAnim,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            clickedLeftDown = false
            leftDownZoneAnim.destroy()
          }
        });
      }
    }

    // const jumpBtn = new Button(this._scene, centerX / 3, height - 137, 'button')
    // jumpBtn.text = this._scene.add.text(jumpBtn.x, jumpBtn.y, ('jump').toUpperCase(), {
    //   color: '#000000',
    //   fontSize: 32,
    // }).setOrigin(.5, .5)
    let clickedRightUp = false
    const rightUpZone = new Zone(this._scene, centerX * 1.5, height / 4, width / 2, height / 2).setDepth(5)
    rightUpZone.clickCallback = (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.rightUp()

      if (!clickedRightUp) {
        const rightUpZoneAnim = this._scene.add.sprite(centerX * 1.5 - 7, height / 4 + 7, 'modal-full')
          .setDisplaySize(width / 2 - 50, height / 2 - 50)
          .setOrigin(0.5, 0.5)
          .setAlpha(0.6)
          .setDepth(5)
        clickedRightUp = true
        this._scene.tweens.add({
          targets: rightUpZoneAnim,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            clickedRightUp = false
            rightUpZoneAnim.destroy()
          }
        });
      }
    }

    let clickedRightDown = false
    const rightDownZone = new Zone(this._scene, centerX * 1.5, rightUpZone.getBounds().bottom * 1.5, width / 2, height / 2).setDepth(5);;
    rightDownZone.clickCallback = (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.rightDown()

      if (!clickedRightDown) {
        const rightUpZoneAnim = this._scene.add.sprite(centerX * 1.5 - 7, height / 2 + 18, 'modal-full')
          .setDisplaySize(width / 2 - 50, height / 2 - 50)
          .setOrigin(0.5, 0)
          .setAlpha(0.6)
          .setDepth(5)
        clickedRightDown = true
        this._scene.tweens.add({
          targets: rightUpZoneAnim,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            clickedRightDown = false
            rightUpZoneAnim.destroy()
          }
        });
      }
    }
  }

}

export default GameActions;