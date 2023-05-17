import Button from '../components/Button';
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

    new Text(this._scene, 'Меню', { x: centerX, y: centerY - 200, fontSize: 44 })
    const btn = new Button(this._scene, centerX, centerY - 100, 'button').setDepth(10)
    btn.text = this._scene.add.text(btn.x, btn.y, ('Старт').toUpperCase(), {
      color: '#000000',
      fontSize: 32,
    }).setOrigin(.5, .5).setDepth(11);
    btn.callback = (): void => this._play();
  }

  private _play(): void {
    this._scene.scene.start('Game');
  }
}

export default Main;