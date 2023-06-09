//@ts-ignore
import * as Webfont from 'webfontloader';
import loading from '../../assets/images/loading.png';
import Interval from '../actions/Interval';
import Sounds from '../actions/Sounds';
import Settings from '../data/Settings';
import User from '../data/User';
import { platforms } from '../types/enums';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import Ads from '../actions/Ads';
import Api from '../data/Api';
import bg from '../../assets/images/bg/bg.jpg';

declare global {
  interface Window {
    onGPInit: Function;
  }
}

class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  private _fonts: boolean = false;
  private _user: boolean | Promise<boolean> = false;

  public init(): void {
    //@ts-ignore
    Settings.gp = gp
    console.log(Settings.gp)
    this._setFonts()
    this._setSounds()
    this._setInteval()
    Settings.gp.gameStart();
    User.setScore(Settings.gp.player.score)
    this._user = true
  }

  public preload(): void {
    this.load.image('bg', bg);
  }

  public update(): void {
    if (!this._fonts) return;
    if (!this._user) return;
    this._fonts = false;
    this._user = false;
    this.scene.launch('Menu');
  }

  private _setFonts(): void {
    Webfont.load({
      custom: {
        families: ['EpilepsySansBold', 'EpilepsySans']
      },
      active: (): void => {
        this._fonts = true;
      }
    });
  }

  private _setSounds(): void {
    Settings.sounds = new Sounds(this);
  }

  private _setInteval(): void {
    Settings.interval = new Interval(this);
  }

}

export default Boot;