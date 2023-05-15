import Button from '../components/Button';
import Settings from '../data/Settings';
import User from '../data/User';
import Utils from '../data/Utils';
import UI from '../scenes/UI';
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

    // установим масштабирование фона
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);
  }
}

export default Main;