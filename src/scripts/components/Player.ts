import Game from '../scenes/Game';

const MARGIN_X = 150
const MARGIN_X_PLAYER_SPRITE = 330
const MARGIN_Y_PLAYER_SPRITE  = 100

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game) {
    super(
      scene,
      scene.actions.woodElements.leftDown.getBounds().right + MARGIN_X,
      scene.actions.woodElements.leftDown.getBounds().bottom,
      null
    )
    this._scene = scene
    this._build()
  }

  private _scene: Game;
  private _sprite: Phaser.GameObjects.Sprite

  private _build(): void {

    this._scene.add.existing(this);
    this._scene.physics.add.existing(this);
    this._sprite = this._scene.add.sprite(this.x + MARGIN_X_PLAYER_SPRITE, this._scene.scale.height - MARGIN_Y_PLAYER_SPRITE, 'player-down')
    this._sprite.flipX = true
    this._sprite.setOrigin(0.5, 1)
    this._sprite.setScale(1, 1.2)
    this.setBodySize(280, 250)
    this.setAlpha(0)
    this.setDepth(12)
  }

  public right(): void {
    this.setPosition(this._scene.actions.woodElements.rightDown.getBounds().left - MARGIN_X, this.y)
    this._sprite.setPosition(this.x - MARGIN_X_PLAYER_SPRITE, this._scene.scale.height - MARGIN_Y_PLAYER_SPRITE)
    this._sprite.flipX = false
  }

  public left(): void {
    this.setPosition(this._scene.actions.woodElements.leftDown.getBounds().right + MARGIN_X, this.y)
    this._sprite.setPosition(this.x + MARGIN_X_PLAYER_SPRITE, this._scene.scale.height - MARGIN_Y_PLAYER_SPRITE)
    this._sprite.flipX = true
  }

  public down(): void {
    this.setPosition(this.x, this._scene.actions.woodElements.leftDown.getBounds().bottom)
    this._sprite.setTexture('player-down')
  }

  public up(): void {
    this.setPosition(this.x, this._scene.actions.woodElements.leftUp.getBounds().bottom)
    this._sprite.setTexture('player-up')
  }
}

export default Player;