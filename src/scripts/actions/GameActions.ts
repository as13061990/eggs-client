import Game from '../scenes/Game';

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
  }

}

export default GameActions;