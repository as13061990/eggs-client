import egg from '../../assets/images/egg.png';
import eggSmashImg from '../../assets/images/egg-smash.png';
import eggGold from '../../assets/images/egg-gold.png';
import eggGood from '../../assets/images/egg-good.png';
import eggBad from '../../assets/images/egg-bad.png';
import eggHeal from '../../assets/images/egg-heal.png';
import eggHealSmash from '../../assets/images/egg-heal-smash.png';
import eggBomb from '../../assets/images/egg-bomb.png';
import eggBombSmash from '../../assets/images/egg-bomb-smash.png';
import eggScore from '../../assets/images/egg-score.png';

import wood from '../../assets/images/wood.png';
import blackPixel from '../../assets/images/black-pixel.png';
import healthFull from '../../assets/images/hearth-full.png';
import healthEmpty from '../../assets/images/hearth-empty.png';
import keyboardArrows from '../../assets/images/keyboard-arrows.png';
import keyboardWASD from '../../assets/images/keyboard-wasd.png';
import basket from '../../assets/images/basket.png';

import wizzard from '../../assets/images/wizzard.png';

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
import eggHealSmashSound from '../../assets/audio/egg-heal-smash.mp3';
import eggBombSmashSound from '../../assets/audio/egg-bomb-smash.mp3';
import eggCatch from '../../assets/audio/egg-catch.mp3';
import eggGoodSound from '../../assets/audio/egg-good.mp3';
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

    this._scene.load.image('egg', egg);
    this._scene.load.image('egg-gold', eggGold);
    this._scene.load.image('egg-good', eggGood);
    this._scene.load.image('egg-bad', eggBad);
    this._scene.load.image('egg-heal', eggHeal);
    this._scene.load.image('egg-bomb', eggBomb);
    this._scene.load.image('egg-score', eggScore);

    this._scene.load.image('egg-smash', eggSmashImg);
    this._scene.load.image('egg-heal-smash', eggHealSmash);
    this._scene.load.spritesheet('egg-bomb-smash', eggBombSmash, { frameWidth: 128, frameHeight: 128 });

    this._scene.load.image('black-pixel', blackPixel);
    this._scene.load.image('wood', wood);
    this._scene.load.image('health-full', healthFull);
    this._scene.load.image('health-empty', healthEmpty);
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
    
    this._scene.load.image('basket', basket);
    this._scene.load.spritesheet('wizzard', wizzard, { frameWidth: 60, frameHeight: 85 });
  }

  private _loadSounds(): void {
    this._scene.load.audio('egg-smash', eggSmash);
    this._scene.load.audio('egg-catch', eggCatch);
    this._scene.load.audio('egg-good', eggGoodSound)
    this._scene.load.audio('egg-heal-smash', eggHealSmashSound)
    this._scene.load.audio('egg-bomb-smash', eggBombSmashSound)
    
    this._scene.load.audio('heal', heal);
    this._scene.load.audio('keyboard', keyboard);

    this._scene.load.audio('bg', bgSound);

  }
}

export default Loading;