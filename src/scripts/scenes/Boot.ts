import * as Webfont from 'webfontloader';
import Interval from '../actions/Interval';
import Sounds from '../actions/Sounds';
import Settings from '../data/Settings';
import bg from '../../assets/images/bg/bg.jpg';
import Analytics from '../data/Analytics';
import { platforms } from '../types/enums';
import User from '../data/User';
import Api from '../data/Api';

class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  private _fonts: boolean = false;
  private _user: boolean | Promise<boolean> = false;
  private _gp: boolean = false

  public init(): void {
    this._setFonts()
    this._setSounds()
    this._setInteval()
    this._checkPlatform()
    Analytics.init({
      server: 'https://analytics.skorit.ru',
      token: 'f41e36a7c48d3c23d939e7e0b770f9b6'
    });
  }

  public preload(): void {
    this.load.image('bg', bg);
  }

  private _checkPlatform() {
    if (process.env.PLATFORM === 'YANDEX') {
      Settings.setPlatform(platforms.YANDEX)
      this.checkYandexUser()
    }
  }

  public update(): void {
    if (Settings.getPlatform() === platforms.YANDEX) {

    } else {
      if (!Settings.gp) {
        //@ts-ignore
        Settings.gp = gp;
      }

      if (!this._gp && Settings.gp) {
        this._gp = true
        this._user = true
      }
    }

    if (!this._fonts) return;
    if (!this._user) return

    this._fonts = false;
    this._user = false

    if (Settings.getPlatform() !== platforms.YANDEX) {
      Settings.gp.gameStart();
    }


    this.scene.launch('Menu');
  }

  private checkYandexUser(): void {
    const d: Document = document;
    const t: HTMLScriptElement = d.getElementsByTagName('script')[0];
    const s: HTMLScriptElement = d.createElement('script');
    s.src = 'https://yandex.ru/games/sdk/v2';
    s.async = true;
    t.parentNode.insertBefore(s, t);
    s.onload = (): void => {
      window['YaGames'].init().then((ysdk: any) => {
        Settings.ysdk = ysdk;
        ysdk.features.LoadingAPI?.ready();
        ysdk.getPlayer().then(async (_player) => {
          User.setYAID(_player.getUniqueID())
          User.setUsername(_player.getName())
          const ratings = await Api.getRatings()
          const score =  ratings.entries.find((el => el.player.uniqueID === User.getID())).score
          User.setScore(score ? score : 0)
          this._user = true
        }).catch(err => {
          // Ошибка при инициализации объекта Player.
        });
      });
    }
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