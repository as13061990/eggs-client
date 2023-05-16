import Button from '../components/Button';
import Player from '../components/Player';
import Text from '../components/Text';
import Zone from '../components/Zone';
import Session from '../data/Session';
import Settings from '../data/Settings';
import Game from '../scenes/Game';
import Menu from '../scenes/Menu';
import { position, side } from '../types/enums';

class GameActions {
  constructor(scene: Game) {
    this._scene = scene;
  }

  private _scene: Game;

  public build(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;
    const background = this._scene.add.sprite(width / 2, height / 2, 'bg-game');
    background.setOrigin(0.5);

    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);

    this._scene.player = new Player(this._scene)

    this._createUI()
    this._controls()
  }

  private _createUI(): void {
    const sceneMenu = this._scene.game.scene.getScene('Menu') as Menu;

    this._createScore()

    sceneMenu.createMobilePauseButton()
  }

  private _createScore(): void {
    new Text(this._scene, Session.getPoints().toString(), { x: 100, y: 100, fontSize: 44 }).setDepth(6)
  }

  private _controls(): void {
    const sceneMenu = this._scene.game.scene.getScene('Menu') as Menu;
    sceneMenu.input.keyboard.on('keydown-ESC', () => { sceneMenu.gamePause(); console.log('s') }, sceneMenu)

    if(Settings.isMobile()) {
      this._controlsMobile()
    } else {
      this._controlsPC()
    }
  }

  private _controlsPC(): void {
    const cursors = this._scene.input.keyboard.createCursorKeys();
    
    this._scene.input.keyboard.on('keydown-A', () => {
      this._scene.player.left()
    }, this)
    this._scene.input.keyboard.on('keydown-D', () => {
      this._scene.player.right()
    }, this)
    this._scene.input.keyboard.on('keydown-W', () => {
      this._scene.player.setHandPosition(position.UP)
      this._scene.player.up()
    }, this)
    this._scene.input.keyboard.on('keydown-S', () => {
      this._scene.player.setHandPosition(position.DOWN)
      this._scene.player.down()
    }, this)


    cursors.left.on('down', (): void => {
      this._scene.player.left()
    });
    cursors.right.on('down', (): void => {
      this._scene.player.right()
    });
    cursors.down.on('down', (): void => {
      this._scene.player.setHandPosition(position.DOWN)
      this._scene.player.down()
    });
    cursors.up.on('down', (): void => {
      this._scene.player.setHandPosition(position.UP)
      this._scene.player.up()
    });
  }

  private _controlsMobile(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;

    const leftUpZone = new Zone(this._scene, centerX / 2, height / 4, width / 2, height / 2).setDepth(5)
    leftUpZone.clickCallback = (): void => {
      this._scene.player.setHandPosition(position.UP)
      this._scene.player.left()
    }

    const leftDownZone = new Zone(this._scene, centerX / 2, leftUpZone.getBounds().bottom * 1.5, width / 2, height / 2).setDepth(5)
    leftDownZone.clickCallback = (): void => {
      this._scene.player.setHandPosition(position.DOWN)
      this._scene.player.left()
    }

    // const jumpBtn = new Button(this._scene, centerX / 3, height - 137, 'button')
    // jumpBtn.text = this._scene.add.text(jumpBtn.x, jumpBtn.y, ('jump').toUpperCase(), {
    //   color: '#000000',
    //   fontSize: 32,
    // }).setOrigin(.5, .5)

    const rightUpZone = new Zone(this._scene, centerX * 1.5, height / 4, width / 2, height / 2).setDepth(5)
    rightUpZone.clickCallback = (): void => {
      this._scene.player.setHandPosition(position.UP)
      this._scene.player.right()
    }

    const rightDownZone = new Zone(this._scene, centerX * 1.5, rightUpZone.getBounds().bottom * 1.5, width / 2, height / 2).setDepth(5);;
    rightDownZone.clickCallback = (): void => {
      this._scene.player.setHandPosition(position.DOWN)
      this._scene.player.right()
    }
  }

}

export default GameActions;