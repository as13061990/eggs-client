import Button from '../components/Button';
import Player from '../components/Player';
import Text from '../components/Text';
import Session from '../data/Session';
import Game from '../scenes/Game';
import Menu from '../scenes/Menu';
import { side } from '../types/enums';

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
    new Text(this._scene, Session.getPoints().toString(), {x: 100, y: 100, fontSize: 44 }).setDepth(6)
  }

  private _controls(): void {
    const sceneMenu = this._scene.game.scene.getScene('Menu') as Menu;
    sceneMenu.input.keyboard.on('keydown-ESC', () => {sceneMenu.gamePause(); console.log('s') }, sceneMenu)

    this._controlsPC()
  }

  private _controlsPC(): void {
    const cursors = this._scene.input.keyboard.createCursorKeys();
    this._scene.input.keyboard.on('keydown-A', () => {
      this._scene.player.setSide(side.LEFT)
    }, this)
    this._scene.input.keyboard.on('keydown-D', () => {
      this._scene.player.setSide(side.RIGHT)
    }, this)
    cursors.left.on('down', (): void => {
      this._scene.player.setSide(side.LEFT)
    });
    cursors.right.on('down', (): void => {
      this._scene.player.setSide(side.RIGHT)
    });

  }

}

export default GameActions;