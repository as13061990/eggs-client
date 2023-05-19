import egg from '../../assets/images/egg.png';
import wood from '../../assets/images/wood.png';
import redPixel from '../../assets/images/red-pixel.png';
import playerUP from '../../assets/images/player-up.png';
import playerDown from '../../assets/images/player-down.png';
import healthFull from '../../assets/images/hearth-full.png';
import healthEmpty from '../../assets/images/hearth-empty.png';

import bg from '../../assets/images/bg/bg.jpg';
import bg1 from '../../assets/images/bg/bg-1.jpg';
import bg2 from '../../assets/images/bg/bg-2.jpg';
import bg3 from '../../assets/images/bg/bg-3.jpg';
import bg4 from '../../assets/images/bg/bg-4.jpg';
import bg5 from '../../assets/images/bg/bg-5.jpg';

import buttonRedDef from '../../assets/images/buttons/button-red-def.png'
import buttonRedPress from '../../assets/images/buttons/button-red-press.png'
import buttonGreenPress from '../../assets/images/buttons/button-green-press.png'
import buttonGreenDef from '../../assets/images/buttons/button-green-def.png'
import buttonBlueDef from '../../assets/images/buttons/button-blue-def.png'
import buttonBluePress from '../../assets/images/buttons/button-blue-press.png'
import buttonMusicUnmute from '../../assets/images/buttons/button-music-unmute.png.png'
import buttonMusicMute from '../../assets/images/buttons/button-music-mute.png'
import modal from '../../assets/images/buttons/modal.png'

import eggSmash from '../../assets/audio/egg-smash.mp3';
import eggCatch from '../../assets/audio/egg-catch.mp3';
import bgSound from '../../assets/audio/bg.mp3';

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
    this._scene.load.image('player-down', playerDown);
    this._scene.load.image('red-pixel', redPixel);
    this._scene.load.image('egg', egg);
    this._scene.load.image('wood', wood);
    this._scene.load.image('health-full', healthFull);
    this._scene.load.image('health-empty', healthEmpty);

    this._scene.load.image('button-red-def', buttonRedDef);
    this._scene.load.image('button-red-press', buttonRedPress);
    this._scene.load.image('button-green-def', buttonGreenDef);
    this._scene.load.image('button-green-press', buttonGreenPress);
    this._scene.load.image('button-blue-def', buttonBlueDef);
    this._scene.load.image('button-blue-press', buttonBluePress);
    this._scene.load.image('button-music-mute', buttonMusicMute);
    this._scene.load.image('button-music-unmute', buttonMusicUnmute);
    this._scene.load.image('modal', modal);
  }

  private _loadSounds(): void {
    this._scene.load.audio('egg-smash', eggSmash);
    this._scene.load.audio('egg-catch', eggCatch);
    
    this._scene.load.audio('bg', bgSound);

  }
}

export default Loading;