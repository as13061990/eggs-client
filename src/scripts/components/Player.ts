import Game from '../scenes/Game';
import { handPosition } from '../types/enums';

const MARGIN_X = 100
const MARGIN_Y = 100

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(scene, scene.actions.woodElements.leftDown.getBounds().right + MARGIN_X, scene.scale.height - MARGIN_Y, 'button')
    this._scene = scene
    this._build()
  }

  private _scene: Game;
  private _handPosition: handPosition = handPosition.DOWN

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setBodySize(200, 300)
    this.setDepth(12)
  }

  public right(): void {
    this.setPosition(this._scene.actions.woodElements.rightDown.getBounds().left - MARGIN_X, this._scene.scale.height - MARGIN_Y)
    this._handPositionCheck()
  }

  public left(): void {
    this.setPosition(this._scene.actions.woodElements.leftDown.getBounds().right + MARGIN_X, this._scene.scale.height - MARGIN_Y)
    this._handPositionCheck()
  }

  public down(): void {
    // this.setPosition(this.x, this._scene.scale.height - MARGIN_Y)
    const height = this._scene.scale.height - this._scene.actions.woodElements.leftDown.getBounds().bottom
    this.setBodySize(200, 300)
  }

  public up(): void {
    // this.setPosition(this.x, this._scene.scale.height - MARGIN_Y - 500)
    const height = this._scene.scale.height - this._scene.actions.woodElements.leftUp.getBounds().bottom
    this.setBodySize(200, 1200)
  }

  private _handPositionCheck():void {
    if (this._handPosition === handPosition.UP) {
      this.up()
    } else if (this._handPosition === handPosition.DOWN) {
      this.down()
    }
  }

  public setHandPosition(position: handPosition): void {
    this._handPosition = position
  }

}

export default Player;