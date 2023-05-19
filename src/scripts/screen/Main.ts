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
    modal.setDisplaySize(modal.width, modal.height - 65)
    const btnPlay = new Button(this._scene, centerX, modal.getBounds().top + 60, 'button-green-def').setDepth(10)
    btnPlay.text = this._scene.add.text(btnPlay.x, btnPlay.y, ('Играть').toUpperCase(), {
      color: 'white',
      fontSize: 32,
      fontStyle: 'bold'
    }).setOrigin(.5, .5).setDepth(11);
    btnPlay.callback = (): void => this._play();

    const btnRatings = new Button(this._scene, centerX, btnPlay.getBounds().bottom + 60, 'button-blue-def').setDepth(10)
    btnRatings.text = this._scene.add.text(btnRatings.x, btnRatings.y, ('Рейтинг').toUpperCase(), {
      color: 'white',
      fontSize: 32,
      fontStyle: 'bold'
    }).setOrigin(.5, .5).setDepth(11);

    const btnMusicTexture = Settings.sounds.getVolume() === 1 ? 'button-music-unmute' : 'button-music-mute'
    const btnMusic = new Button(this._scene, modal.getBounds().left + 60, modal.getBounds().bottom - 60, btnMusicTexture).setDepth(10)
    btnMusic.callback = (): void => {
      if (Settings.sounds.getVolume() === 1) {
        Settings.sounds.mute()
        btnMusic.setTexture('button-music-mute')
      } else {
        Settings.sounds.unmute()
        btnMusic.setTexture('button-music-unmute')
      }
    }

    Settings.sounds.playMusic('bg')
  }

  private _play(): void {
    this._scene.scene.start('Game');
  }
}

export default Main;