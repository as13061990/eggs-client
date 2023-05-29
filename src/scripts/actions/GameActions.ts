import Egg from '../components/Egg';
import Player from '../components/Player';
import Wood from '../components/Wood';
import Zone from '../components/Zone';
import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';
import UI from '../scenes/UI';

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

    this._collisions()

    this._createEggsGroup()
  }

  private _createUI(): void {
    const sceneUI = this._scene.game.scene.getScene('UI') as UI;

    sceneUI.createMobilePauseButton()
    sceneUI.createScore()
    sceneUI.createHealth()
    sceneUI.creatTutorial()

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
    egg.destroy()
    egg.stopTween()
    Session.plusPoints(1)
    const sceneUI = this._scene.game.scene.getScene('UI') as UI;
    Settings.sounds.play('egg-catch')
    sceneUI.score.setText(Session.getPoints().toString())
  }


  private _createEggsGroup(): void {
    const delay = Session.getDifficulty() * 1000
    this._scene.time.addEvent({
      delay: delay, callback: (): void => {
        this._spawnEgg()
        this._createEggsGroup()
      }
    , loop: false});
  }

  private _spawnEgg(): void {
    const diff = Session.getDifficulty()
    if (diff > 1.2) {
      const randomNumber = Phaser.Math.Between(0, 3);
      new Egg(this._scene, randomNumber)
    } else if (diff <= 1.2 && diff >= 0.8 ) {
      const randomNumber = Phaser.Math.Between(0, 3);
      new Egg(this._scene, randomNumber)
      this._scene.time.addEvent({
        delay: 300, callback: (): void => {
          new Egg(this._scene, Math.abs(randomNumber - 2))
        }
      , loop: false});
    } else if (diff < 0.8 ) {
      const randomNumber = Phaser.Math.Between(0, 3);
      new Egg(this._scene, randomNumber)
      this._scene.time.addEvent({
        delay: 200, callback: (): void => {
          new Egg(this._scene, Math.abs(randomNumber - 1))
          new Egg(this._scene, Math.abs(randomNumber - 3))
        }
      , loop: false});
    }
  }

  private _controls(): void {
    const sceneUI = this._scene.game.scene.getScene('UI') as UI;
    sceneUI.input.keyboard.on('keydown-ESC', () => { sceneUI.gamePause(); console.log('s') }, sceneUI)

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

    const leftUpZone = new Zone(this._scene, centerX / 2, height / 4, width / 2, height / 2).setDepth(5)
    leftUpZone.clickCallback = (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.up()
      this._scene.player.left()
    }

    const leftDownZone = new Zone(this._scene, centerX / 2, leftUpZone.getBounds().bottom * 1.5, width / 2, height / 2).setDepth(5)
    leftDownZone.clickCallback = (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.down()
      this._scene.player.left()
    }

    // const jumpBtn = new Button(this._scene, centerX / 3, height - 137, 'button')
    // jumpBtn.text = this._scene.add.text(jumpBtn.x, jumpBtn.y, ('jump').toUpperCase(), {
    //   color: '#000000',
    //   fontSize: 32,
    // }).setOrigin(.5, .5)

    const rightUpZone = new Zone(this._scene, centerX * 1.5, height / 4, width / 2, height / 2).setDepth(5)
    rightUpZone.clickCallback = (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.up()
      this._scene.player.right()
    }

    const rightDownZone = new Zone(this._scene, centerX * 1.5, rightUpZone.getBounds().bottom * 1.5, width / 2, height / 2).setDepth(5);;
    rightDownZone.clickCallback = (): void => {
      Settings.sounds.play('keyboard')
      this._scene.player.right()
      this._scene.player.down()
    }
  }

}

export default GameActions;