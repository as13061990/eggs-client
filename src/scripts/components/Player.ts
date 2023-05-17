import Game from '../scenes/Game';

const MARGIN_X = 100

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(
      scene,
      scene.actions.woodElements.leftDown.getBounds().right + MARGIN_X,
      scene.actions.woodElements.leftDown.getBounds().bottom,
      'button'
    )
    this._scene = scene
    this._build()
  }

  private _scene: Game;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this.setDepth(12)
  }

  public right(): void {
    this.setPosition(this._scene.actions.woodElements.rightDown.getBounds().left - MARGIN_X, this.y)
  }

  public left(): void {
    this.setPosition(this._scene.actions.woodElements.leftDown.getBounds().right + MARGIN_X, this.y)
  }

  public down(): void {
    this.setPosition(this.x, this._scene.actions.woodElements.leftDown.getBounds().bottom)
  }

  public up(): void {
    this.setPosition(this.x, this._scene.actions.woodElements.leftUp.getBounds().bottom)
  }
}

export default Player;