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

class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  private _fonts: boolean = false;
  private _user: boolean | Promise<boolean> = false;

  public init(): void {
    this._setFonts()
    this._setSounds()
    this._setInteval()

    this._setPlatform()
    Ads.checkReadyAd()
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

  private _setPlatform(): void {
    const search: string = window.location.search;
    const params = new URLSearchParams(search);
    const vk: string = params.get('api_url');
    if (vk === 'https://api.vk.com/api.php') Settings.setPlatform(platforms.VK)
    this._initUser()
  }

  private _initUser(): void {
    const platform = Settings.getPlatform()
    if (platform === platforms.VK) {
      this._initUserVK();
    } else {
      this._initUserWeb();
    }
  }

  private async _initUserVK(): Promise<void> {
    bridge.send('VKWebAppInit', {});
    let bridgeData: UserInfo = await bridge.send('VKWebAppGetUserInfo', {});
    // this.postCheckUser(bridgeData.id);
    // this.state.vkId = bridgeData.id;
    if (bridgeData?.id) {
      User.setVKID(bridgeData.id)
      User.setFirstName(bridgeData.first_name)
      User.setLastName(bridgeData.last_name)
      User.setUsername(bridgeData.first_name + ' ' + bridgeData.last_name)
      this._user = Api.postCheckUser()
    }
  }

  private _initUserWeb(): void {
    const score = Number(localStorage.getItem('score'));
    if (!isNaN(score)) {
      User.setScore(score);
    } else {
      localStorage.setItem('score', String(0));
      User.setScore(0);
    }
    this._user = true;
  }
}

export default Boot;