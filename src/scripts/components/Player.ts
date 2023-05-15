import Game from '../scenes/Game';
import { side } from '../types/enums';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, 400, 300, 'button')
    this._scene = scene
    this._build()
  }

  private _scene: Game;
  private _side: side = side.LEFT;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setDepth(12)
    this.setScale(1, 5)
  }

  public right(): void {
    this.setPosition(1200, 300)
  }

  public left(): void {
    this.setPosition(400, 300)
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);

    if (this._side === side.LEFT) {
      this.left();
    } else if (this._side === side.RIGHT) {
      this.right();
    } 
  }

  public setSide(side: side): void {
    this._side = side
  }

}

export default Player;