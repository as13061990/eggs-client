import Modal from '../components/Modal';
import Settings from '../data/Settings';
import UI from '../scenes/Menu';
import { screen } from '../types/enums';

const rightModalBoosters = [{ img: 'egg-heal', info: ' - Дает 1 дополнительную \n жизнь' }, { img: 'egg-score', info: ' - Удваивает очки' }, { img: 'egg-good', info: ' - Замедляет другие яйца' }, { img: 'egg-gold', info: ' - Собирает яйца на экране' },]

const leftModalBoosters = [{ img: 'egg-bomb', info: ' - Взрывает все яйца' }, { img: 'egg-bad', info: ' - Уменьшает видимость' },]


class Main {
  constructor(scene: UI) {
    this._scene = scene;
    this._build();
  }

  private _scene: UI;
  private _modal: Modal

  private _build(): void {
    const { width, height } = this._scene.cameras.main;
    const background = this._scene.add.sprite(width / 2, height, 'bg');
    background.setOrigin(0.5, 1);

    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);

    this._modal = new Modal(this._scene, 'button-green-def', 'button-blue-def')

    this._modal.setTextBtn('first', 'Играть')
    this._modal.setTextBtn('second', 'Рейтинг')

    this._modal.btnFirst.callback = (): void => this._play()
    if (this._modal.btnSecond) {
      this._modal.btnSecond.callback = (): void => { Settings.setScreen(screen.RATING); this._scene.scene.restart(); }
    }

    Settings.sounds.playMusic('bg')

    if (Settings.getTutorial()) {
      this._buildRightBoosterInfo()
      this._buildLeftBoosterInfo()
    }

  }

  private _buildRightBoosterInfo(): void {
    const { centerY } = this._scene.cameras.main;
    const modal = this._scene.add.sprite(this._modal.getBounds().right + 300, centerY, 'modal').setOrigin(0.5, 0.5)
    modal.setDisplaySize(modal.width * 1.8, modal.height * 1.3)

    const title = this._scene.add.text(modal.getBounds().centerX, modal.getBounds().top + 30, 'Хорошие бустеры', { font: '38px EpilepsySansBold', color: 'black' }).setOrigin(0.5, 0.5)

    rightModalBoosters.forEach((booster, i) => {
      const sprite = this._scene.add.sprite(modal.getBounds().left + 30, title.getBounds().bottom + 80 + (100 * i), booster.img).setOrigin(0, 0.5)
      this._scene.add.text(sprite.getBounds().right + 10, sprite.getBounds().centerY, booster.info, { font: '30px EpilepsySansBold', color: 'black' }).setOrigin(0, 0.5)
    })
  }

  private _buildLeftBoosterInfo(): void {
    const { centerY } = this._scene.cameras.main;
    const modal = this._scene.add.sprite(this._modal.getBounds().left - 300, centerY, 'modal').setOrigin(0.5, 0.5)
    modal.setDisplaySize(modal.width * 1.8, modal.height * 1.3)

    const title = this._scene.add.text(modal.getBounds().centerX, modal.getBounds().top + 30, 'Плохие бустеры', { font: '38px EpilepsySansBold', color: 'black' }).setOrigin(0.5, 0.5)

    leftModalBoosters.forEach((booster, i) => {
      const sprite = this._scene.add.sprite(modal.getBounds().left + 30, title.getBounds().bottom + 80 + (100 * i), booster.img).setOrigin(0, 0.5)
      this._scene.add.text(sprite.getBounds().right + 10, sprite.getBounds().centerY, booster.info, { font: '30px EpilepsySansBold', color: 'black' }).setOrigin(0, 0.5)
    })
  }

  private _play(): void {
    this._scene.scene.start('Game');
  }
}

export default Main;