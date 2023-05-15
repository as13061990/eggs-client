import Interval from '../actions/Interval';
import { screen } from '../types/enums';

class Settings {

  public readonly sizes = {
    minWidth: 1920,
    maxWidth: 2560,
    minHeight: 1080,
    maxHeight: 1440
  }
  private _screen: screen = screen.MAIN;
  private _mobile: boolean = false;
  public sounds: Isounds;
  public interval: Interval;

  public setScreen(screen: screen): screen {
    this._screen = screen;
    return this._screen;
  }

  public getScreen(): screen {
    return this._screen;
  }

  public isMobile(): boolean {
    return this._mobile;
  }

  public setMobile(mobile: boolean): void {
    this._mobile = mobile;
  }
}

export default new Settings();