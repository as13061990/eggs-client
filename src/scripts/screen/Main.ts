import Button from '../components/Button';
import Modal from '../components/Modal';
import Text from '../components/Text';
import Settings from '../data/Settings';
import User from '../data/User';
import Utils from '../data/Utils';
import UI from '../scenes/Menu';
import { screen } from '../types/enums';

class Main {
  constructor(scene: UI) {
    this._scene = scene;
    this._build();
  }

  private _scene: UI;

  private _build(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;
    const background = this._scene.add.sprite(width / 2, height / 2, 'bg');
    background.setOrigin(0.5);

    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);

    const modal = new Modal(this._scene, 'button-green-def', 'button-blue-def')

    modal.setTextBtn('first', 'Играть')
    modal.setTextBtn('second', 'Рейтинг')

    modal.btnFirst.callback = (): void => this._play()

    Settings.sounds.playMusic('bg')
    
  }

  private _play(): void {
    this._scene.scene.start('Game');
  }
}

export default Main;