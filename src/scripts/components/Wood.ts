import Game from "../scenes/Game";

class Wood extends Phaser.GameObjects.Sprite {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'wood');
    this._scene = scene;
    this._build();
  }

  private _scene: Game;

  private _build(): void {
    this._scene.add.existing(this);
  }

}

export default Wood;