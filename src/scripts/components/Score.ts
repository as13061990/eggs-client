import Session from "../data/Session";
import UI from "../scenes/UI";

class Score extends Phaser.GameObjects.Text {
  constructor(scene: UI) {
    super(scene, 68, 60, Session.getPoints().toString(), { font: '64px EpilepsySansBold', color: 'yellow' })
    this._scene = scene
    this._build()
  }

  private _scene: UI

  private _build(): void {
    this._scene.add.existing(this);

  }

  protected preUpdate(time: number, delta: number): void {
    if (this.text !== Session.getPoints().toString()) {
      console.log('score')
      this.setText(Session.getPoints().toString())
    }
  }
}

export default Score