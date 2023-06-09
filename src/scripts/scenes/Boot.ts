import * as Webfont from 'webfontloader';
import Interval from '../actions/Interval';
import Sounds from '../actions/Sounds';
import Settings from '../data/Settings';
import bg from '../../assets/images/bg/bg.jpg';

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
  }

  public preload(): void {
    this.load.image('bg', bg);
  }

  public update(): void {
    if (!Settings.gp) {
      //@ts-ignore
      Settings.gp = gp;
    }

    if (!this._gp && Settings.gp) {
      this._gp = true
      this._user = true
    }
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