import egg from '../../assets/images/egg.png';
import wood from '../../assets/images/wood.png';
import blackPixel from '../../assets/images/black-pixel.png';
import playerUP from '../../assets/images/player-up.png';
import playerDown from '../../assets/images/player-down.png';
import healthFull from '../../assets/images/hearth-full.png';
import healthEmpty from '../../assets/images/hearth-empty.png';
import eggSmashImg from '../../assets/images/egg-smash.png';
import keyboardArrows from '../../assets/images/keyboard-arrows.png';
import keyboardWASD from '../../assets/images/keyboard-wasd.png';

import bg1 from '../../assets/images/bg/bg-1.jpg';
import bg2 from '../../assets/images/bg/bg-2.jpg';
import bg3 from '../../assets/images/bg/bg-3.jpg';
import bg4 from '../../assets/images/bg/bg-4.jpg';
import bg5 from '../../assets/images/bg/bg-5.jpg';

import buttonRedDef from '../../assets/images/buttons/button-red-def.png'
import buttonGreenDef from '../../assets/images/buttons/button-green-def.png'
import buttonBlueDef from '../../assets/images/buttons/button-blue-def.png'
import buttonMusicUnmute from '../../assets/images/buttons/button-music-unmute.png.png'
import buttonMusicMute from '../../assets/images/buttons/button-music-mute.png'
import modal from '../../assets/images/buttons/modal.png'
import modalFull from '../../assets/images/buttons/modal-full.png'
import pause from '../../assets/images/buttons/pause.png'
import resume from '../../assets/images/buttons/resume.png'

import eggSmash from '../../assets/audio/egg-smash.mp3';
import eggCatch from '../../assets/audio/egg-catch.mp3';
import bgSound from '../../assets/audio/bg.mp3';
import heal from '../../assets/audio/heal.mp3';
import keyboard from '../../assets/audio/keyboard.mp3';

import Session from '../data/Session';

class Loading {
  constructor(scene: Phaser.Scene) {
    this._scene = scene;
    this._build();
  }

  private _scene: Phaser.Scene;

  private _build(): void {
    const { centerX, centerY, width, height } = this._scene.cameras.main;

    const background = this._scene.add.sprite(width / 2, height, 'bg');
    background.setOrigin(0.5, 1);
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);

    const text = this._scene.add.text(centerX, centerY, 'Loading...0%', {
      color: 'white',
      font: '72px EpilepsySansBold',
    }).setOrigin(.5, .5);

    const build = this._scene.add.text(10, 10, 'build: ' + process.env.BUILD_TIME, {
      font: '25px Triomphe',
      color: '#FFFFFF'
    });

    this._scene.load.on('progress', (value: number): void => {
      const totalFiles = this._scene.load.totalToLoad
      const percent = Math.round(value * 100);
      if (totalFiles !== 1) text.setText('Loading...' + percent + '%');
      else text.setText('Loading...')
    }, this);

    this._scene.load.on('complete', (): void => {
      this._scene.load.removeAllListeners();

      text.destroy();
      build.destroy();
      background.destroy()
    }, this);

    this._loadImages();
    this._loadSounds();
  }

  private _loadImages(): void {

    const arr = [bg1, bg2, bg3, bg4, bg5]
    const randomNumber = Phaser.Math.Between(1, 5)
    Session.setBg(randomNumber)
    this._scene.load.image(`bg-${randomNumber}`, arr[randomNumber - 1]);

    this._scene.load.image('player-up', playerUP);
    this._scene.load.image('player-down', playerDown);
    this._scene.load.image('black-pixel', blackPixel);
    this._scene.load.image('egg', egg);
    this._scene.load.image('wood', wood);
    this._scene.load.image('health-full', healthFull);
    this._scene.load.image('health-empty', healthEmpty);
    this._scene.load.image('egg-smash', eggSmashImg);
    this._scene.load.image('keyboard-arrows', keyboardArrows);
    this._scene.load.image('keyboard-wasd', keyboardWASD);

    this._scene.load.image('button-red-def', buttonRedDef);
    this._scene.load.image('button-green-def', buttonGreenDef);
    this._scene.load.image('button-blue-def', buttonBlueDef);
    this._scene.load.image('button-music-mute', buttonMusicMute);
    this._scene.load.image('button-music-unmute', buttonMusicUnmute);
    this._scene.load.image('pause', pause);
    this._scene.load.image('resume', resume);
    this._scene.load.image('modal', modal);
    this._scene.load.image('modal-full', modalFull);
  }

  private _loadSounds(): void {
    this._scene.load.audio('egg-smash', eggSmash);
    this._scene.load.audio('egg-catch', eggCatch);

    this._scene.load.audio('heal', heal);
    this._scene.load.audio('keyboard', keyboard);

    this._scene.load.audio('bg', bgSound);

  }
}

export default Loading;