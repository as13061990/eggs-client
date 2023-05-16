import Game from '../scenes/Game';
import { position } from '../types/enums';

const MARGIN_X = 700
const MARGIN_Y = 300

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, MARGIN_X, scene.scale.height - MARGIN_Y, 'button')
    this._scene = scene
    this._build()
  }

  private _scene: Game;
  private _handPosition: position = position.DOWN

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setDepth(12)
    this.setScale(1, 5)
  }

  public right(): void {
    this.setPosition(this._scene.scale.width - MARGIN_X, this._scene.scale.height - MARGIN_Y)
    this._handPositionCheck()
  }

  public left(): void {
    this.setPosition(MARGIN_X, this._scene.scale.height - MARGIN_Y)
    this._handPositionCheck()
  }

  public down(): void {
    this.setPosition(this.x, this._scene.scale.height - MARGIN_Y)
  }

  public up(): void {
    this.setPosition(this.x, this._scene.scale.height - MARGIN_Y - 500)
  }

  private _handPositionCheck():void {
    if (this._handPosition === position.UP) {
      this.up()
    } else if (this._handPosition === position.DOWN) {
      this.down()
    }
  }

  public setHandPosition(position: position): void {
    this._handPosition = position
  }

}

export default Player;