import Button from '../components/Button';
import Modal from '../components/Modal';
import Settings from '../data/Settings';
import UI from '../scenes/Menu';
import { screen } from '../types/enums';

const rightModalBoosters = [{ img: 'egg-heal', info: ' - Дает 1 дополнительную \n жизнь' }, { img: 'egg-score', info: ' - Удваивает очки' }, { img: 'egg-good', info: ' - Замедляет другие яйца' }, { img: 'egg-gold', info: ' - Собирает яйца на экране' },]

const leftModalBoosters = [{ img: 'egg-bomb', info: ' - Взрывает все яйца' }, { img: 'egg-bad', info: ' - Уменьшает видимость' },]


class BoosterInfo {
  constructor(scene: UI) {
    this._scene = scene;
    this._build();
  }

  private _scene: UI;
  private _modal: Phaser.GameObjects.Sprite

  private _build(): void {
    const { width, height } = this._scene.cameras.main;
    const background = this._scene.add.sprite(width / 2, height, 'bg');
    background.setOrigin(0.5, 1);

    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);


    const { centerY, centerX } = this._scene.cameras.main;
    this._modal = this._scene.add.sprite(centerX, centerY, 'modal').setOrigin(0.5, 0.5)
    this._modal.setDisplaySize(this._modal.width * 3.6, this._modal.height * 1.4)
    const title = this._scene.add.text(this._modal.getBounds().centerX, this._modal.getBounds().top + 40, 'Бустеры', { font: '48px EpilepsySansBold', color: 'black' }).setOrigin(0.5, 0.5)
    this._buildRightBoosterInfo()
    this._buildLeftBoosterInfo()
  }

  private _buildRightBoosterInfo(): void {
    rightModalBoosters.forEach((booster, i) => {
      const sprite = this._scene.add.sprite(this._modal.getBounds().right - 420, this._modal.getBounds().top + 150 + (100 * i), booster.img).setOrigin(1, 0.5)
      this._scene.add.text(sprite.getBounds().right + 10, sprite.getBounds().centerY, booster.info, { font: '30px EpilepsySansBold', color: 'black' }).setOrigin(0, 0.5)
    })
  }

  private _buildLeftBoosterInfo(): void {
    leftModalBoosters.forEach((booster, i) => {
      const sprite = this._scene.add.sprite(this._modal.getBounds().left + 30, this._modal.getBounds().top + 150 + (100 * i), booster.img).setOrigin(0, 0.5)
      this._scene.add.text(sprite.getBounds().right + 10, sprite.getBounds().centerY, booster.info, { font: '30px EpilepsySansBold', color: 'black' }).setOrigin(0, 0.5)
    })

    const button = new Button(this._scene, this._modal.getBounds().left + 240, this._modal.getBounds().bottom - 110, 'button-green-def')
    button.text = this._scene.add.text(button.getBounds().centerX, button.y, ('Понятно').toUpperCase(), {
      color: 'white',
      font: '36px EpilepsySans'
    }).setOrigin(0.5, .6).setDepth(11);

    button.callback = () => this._play()
  }

  private _play(): void {

    this._scene.scene.start('Game');
  }
}

export default BoosterInfo;