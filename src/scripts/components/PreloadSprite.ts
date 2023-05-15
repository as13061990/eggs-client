class PreloadSprite extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, path: string) {
    super(scene, x, y, 'preload-sprite');
    this._scene = scene;
    this._texture = texture;
    this._path = path;
    this._build();
  }
  
  private _scene: Phaser.Scene;
  private _texture: string;
  private _path: string;
  public callback: Function = (): void => {};

  private _build(): void {
    this._scene.add.existing(this);
    this._scene.load.image(this._texture,  this._path);
    this._scene.load.once('complete', () => {
      this.setTexture(this._texture);
      this.callback();
    });
    this._scene.load.start();
  }
}
export default PreloadSprite;