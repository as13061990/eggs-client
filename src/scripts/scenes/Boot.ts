import axios from 'axios';
//@ts-ignore
import * as Webfont from 'webfontloader';
import loading from '../../assets/images/loading.png';
import Interval from '../actions/Interval';
import Sounds from '../actions/Sounds';
import Settings from '../data/Settings';
import User from '../data/User';
import { platforms } from '../types/enums';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';

class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  private _fonts: boolean = false;
  private _user: boolean = false;

  public init(): void {
    this._setFonts()
    this._setSounds()
    this._setInteval()

    this._setPlatform()
  }

  public preload(): void {
    this.load.image('loading', loading);
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
        families: ['Triomphe']
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
    console.log(bridgeData)
  }

  private _initUserWeb(): void {
    const id = localStorage.getItem('id');
    if (id) {
      User.setID(id);
    } else {
      User.setID(this._randomString(10));
      localStorage.setItem('id', String(User.getID()));
    }
    this._user = true;
  }

  private _randomString(length: number = 5): string {
    let characters: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let rs: string = '';

    while (rs.length < length) {
      rs += characters[Math.floor(Math.random() * characters.length)];
    }

    return rs;
  }

}

export default Boot;