import './types/interfaces';
import '../assets/css/style.css';
import * as Phaser from 'phaser';
import Boot from './scenes/Boot';
import UI from './scenes/Menu';
import Settings from './data/Settings';
import Utils from './data/Utils';
import Game from './scenes/Game';
import Menu from './scenes/UI';
import * as platform from 'platform'

window.onload = (): void => {
  setTimeout((): void => {
    const root: HTMLElement = document.querySelector('#root');
    const clientHeight = Math.round(document.body.clientHeight);
    const clientWidth = Math.round(document.body.clientWidth);
    const canvasHeight = Settings.sizes.height;
    let canvasWidth = Math.round((Settings.sizes.height * clientWidth) / clientHeight);
    let width = 0, height = 0;
    
    if (canvasWidth > Settings.sizes.maxWidth) canvasWidth = Settings.sizes.maxWidth;
    else if (canvasWidth < Settings.sizes.minWidth) canvasWidth = Settings.sizes.minWidth;
 
    const x = canvasWidth / Utils.gcd(canvasHeight, canvasWidth);
    const y = canvasHeight / Utils.gcd(canvasHeight, canvasWidth);

    if (clientHeight / y > clientWidth / x) {
      width = clientWidth;
      height = clientWidth / x * y;
    } else {
      width = clientHeight / y * x;
      height = clientHeight;
    }

    if (platform.os.family === 'iOS' || platform.os.family === 'Android') {
      Settings.setMobile(true);
    }

    root.style.height = height + 'px';
    root.style.width = width + 'px';

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      width: canvasWidth,
      height: canvasHeight,
      parent: 'root',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      render: { transparent: true },
      scene: [Boot, Game, Menu, UI,]
    }
    new Phaser.Game(config);
  }, 100);
}