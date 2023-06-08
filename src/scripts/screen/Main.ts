import Modal from '../components/Modal';
import Settings from '../data/Settings';
import UI from '../scenes/Menu';
import { screen } from '../types/enums';

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
  }

  private _play(): void {
    if (Settings.getTutorial()) {
      Settings.setScreen(screen.BOOSTER)
      this._scene.scene.restart() 
    } else {
      this._scene.scene.start('Game');
    }
  }
}

export default Main;