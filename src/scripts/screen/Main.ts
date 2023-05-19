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

    const modal = this._scene.add.sprite(centerX, centerY, 'modal')

    const btn = new Button(this._scene, centerX, modal.getBounds().top + 60, 'button-green-def').setDepth(10)
    btn.text = this._scene.add.text(btn.x, btn.y, ('Играть').toUpperCase(), {
      color: 'white',
      fontSize: 32,
      fontStyle: 'bold'
    }).setOrigin(.5, .5).setDepth(11);
    btn.callback = (): void => this._play();

    Settings.sounds.playMusic('bg')
  }

  private _play(): void {
    this._scene.scene.start('Game');
  }
}

export default Main;