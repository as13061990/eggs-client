import Button from '../components/Button';
import UI from '../scenes/UI';

class RewardLifeAd {
  constructor(scene: Phaser.Scene, isUIScene?: boolean) {
    this._scene = scene;
    this._build();
  }

  private _scene: Phaser.Scene;
  private _timerNumber: number = 5;
  private _timerText: Phaser.GameObjects.Text;
  private _interval: Phaser.Time.TimerEvent
  private _modal: Phaser.GameObjects.Sprite
  private _elements: (Phaser.GameObjects.Sprite | Phaser.GameObjects.Text | Phaser.Time.TimerEvent)[] = []

  private _build(): void {
    const { centerX, centerY } = this._scene.cameras.main;

    this._modal = this._scene.add.sprite(centerX, centerY, 'modal')
    this._modal.setDisplaySize(this._modal.width, this._modal.height + 30).setDepth(21);

    const plus = this._scene.add.text(centerX - 40, centerY - 130, ('+').toUpperCase(), {
      align: 'center',
      color: 'black',
      font: '72px EpilepsySansBold',
    }).setOrigin(0.5, 0.5).setDepth(21);

    const text = this._scene.add.text(centerX, centerY - 50, ('за рекламу').toUpperCase(), {
      align: 'center',
      color: 'black',
      font: '36px EpilepsySansBold',
    }).setOrigin(0.5, 0.5).setDepth(21);

    const health = this._scene.add.sprite(plus.getBounds().right + 50, plus.y, 'health-full').setDepth(21);

    const btn = new Button(this._scene, centerX, this._modal.getBounds().bottom - 70, 'button-blue-def').setDepth(21);
    btn.text = this._scene.add.text(btn.x, btn.y, ('Смотреть').toUpperCase(), {
      color: 'white',
      font: '36px EpilepsySans'
    }).setOrigin(.5, .6).setDepth(21);

    this._timerText = this._scene.add.text(centerX, centerY + 30, ('5').toUpperCase(), {
      align: 'center',
      color: 'black',
      font: '72px EpilepsySansBold',
    }).setOrigin(0.5, 0.5).setDepth(21);

    this._interval = this._scene.time.addEvent({
      delay: 1000,
      callback: (): void => {
        this._minusTimer()
      }
    , loop: true});

    this._elements.push(this._modal, text, health, this._timerText, plus, btn, this._interval)
  }

  private _minusTimer(): void {
    if (this._timerNumber === 0) {
      this.destroy()
      return
    }
    this._timerNumber -= 1
    this._timerText.setText(this._timerNumber.toString())
  }


  public destroy(): void {
    this._elements.forEach(el => {
      el.destroy()
    })
    this._interval.destroy()
    const sceneUI = this._scene as UI
    sceneUI.activeInteractiveBtns()
  }

}

export default RewardLifeAd;