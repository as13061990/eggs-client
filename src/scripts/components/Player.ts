import Settings from '../data/Settings';
import Game from '../scenes/Game';
import UI from '../scenes/UI';
import { ESettings } from '../types/enums';
import Zone from './Zone';

enum side {
  LEFT,
  RIGHT
}

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene)
    this._scene = scene
  }

  private _scene: Game;
  private _side: side = side.RIGHT;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.body.setSize(this.width + 10, this.height - 35);
    this.setDepth(10)
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.setScale(3.5, 3.5)
  }

}

export default Player;