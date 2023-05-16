import Game from "../scenes/Game";

class Wood extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'wood');
    this._scene = scene;
    this._build();
  }

  private _scene: Game;

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.wood.add(this);
  }

}

export default Wood;