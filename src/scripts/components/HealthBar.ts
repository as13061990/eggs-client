import Session from "../data/Session"

const MARGIN_BETWEEN = 40
class HealthBar {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    this._scene = scene
    this._healthFirst = this._scene.add.sprite(x, y, 'health-full')
    this._build()
  }

  private _scene: Phaser.Scene

  private _healthFirst: Phaser.GameObjects.Sprite
  private _healthSecond: Phaser.GameObjects.Sprite
  private _healthThird: Phaser.GameObjects.Sprite

  private _build(): void {
    this._healthSecond = this._scene.add.sprite(this._healthFirst.getBounds().right + MARGIN_BETWEEN , this._healthFirst.y, 'health-full')
    this._healthThird = this._scene.add.sprite(this._healthSecond.getBounds().right + MARGIN_BETWEEN , this._healthFirst.y, 'health-full')
  }

  public minusHealth(): void {
    Session.minusHealth()
    switch (Session.getHealth()) {
      case 0:
        this._healthFirst.setTexture('health-empty')
        break;
      case 1:
        this._healthSecond.setTexture('health-empty')
        break;
      case 2:
        this._healthThird.setTexture('health-empty')
        break;
    }
  }

  public plusHealth(): void {
    Session.plusHealth()
    switch (Session.getHealth()) {
      case 1:
        this._healthFirst.setTexture('health-full')
        break;
      case 2:
        this._healthSecond.setTexture('health-full')
        break;
      case 3:
        this._healthThird.setTexture('health-full')
        break;
    }
  }

}

export default HealthBar