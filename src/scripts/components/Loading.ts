import bg from '../../assets/images/bg.jpg';
import egg from '../../assets/images/egg.png';
import wood from '../../assets/images/wood.png';
import bg1 from '../../assets/images/bg-1.jpg';
import bg2 from '../../assets/images/bg-2.jpg';
import bg3 from '../../assets/images/bg-3.jpg';
import bg4 from '../../assets/images/bg-4.jpg';
import bg5 from '../../assets/images/bg-5.jpg';
import button from '../../assets/images/button.png';
import redPixel from '../../assets/images/red-pixel.png';
import playerUP from '../../assets/images/player-up.png';


import eggSmash from '../../assets/audio/egg-smash.mp3';
import Session from '../data/Session';

class Loading {
  constructor(scene: Phaser.Scene) {
    this._scene = scene;
    this._build();
  }

  private _scene: Phaser.Scene;

  private _build(): void {
    const { centerX, centerY } = this._scene.cameras.main;
    const sprite = this._scene.add.sprite(centerX, centerY, 'loading');
    this._scene.add.tween({
      targets: sprite,
      rotation: Math.PI * 2,
      repeat: -1
    });
    const bounds = sprite.getBounds();
    const text = this._scene.add.text(centerX, bounds.bottom + 50, 'Loading...0%', {
      font: '40px Triomphe',
      color: '#FFFFFF'
    }).setOrigin(.5, .5);

    const build = this._scene.add.text(10, 10, 'build: ' + process.env.BUILD_TIME, {
      font: '25px Triomphe',
      color: '#FFFFFF'
    });

    this._scene.load.on('progress', (value: number): void => {
      const percent = Math.round(value * 100);
      text.setText('Loading...' + percent + '%');
    }, this);
    this._scene.load.on('complete', (): void => {
      this._scene.load.removeAllListeners();
      sprite.destroy();
      text.destroy();
      build.destroy();
    }, this);

    this._loadImages();
    this._loadSounds();
  }

  private _loadImages(): void {
    this._scene.load.image('bg', bg);

    const arr = [bg1, bg2, bg3, bg4, bg5]
    const randomNumber = Phaser.Math.Between(1,5)
    Session.setBg(randomNumber)
    this._scene.load.image(`bg-${randomNumber}`, arr[randomNumber-1]);
    this._scene.load.image('player-up', playerUP);
    this._scene.load.image('button', button);
    this._scene.load.image('red-pixel', redPixel);
    this._scene.load.image('egg', egg);
    this._scene.load.image('wood', wood);
  }

  private _loadSounds(): void {
    this._scene.load.audio('eggSmash', eggSmash);
  }
}

export default Loading;