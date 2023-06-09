import Interval from '../actions/Interval';
import { eggType, platforms, screen } from '../types/enums';


class Settings {

  public readonly sizes = {
    minWidth: 1920,
    maxWidth: 2560,
    minHeight: 1080,
    maxHeight: 1440
  }
  private _screen: screen = screen.MAIN;
  private _mobile: boolean = false;
  private _isPaused: boolean = false
  private _platform: platforms = platforms.WEB
  private _adblock: boolean
  private _tutorial: boolean = true
  public sounds: Isounds;
  public interval: Interval;
  public gp: any
  
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

  public getIsPaused(): boolean {
    return this._isPaused
  }

  public setIsPaused(pause: boolean): void {
    this._isPaused = pause
  }

  public getPlatform(): platforms {
    return this._platform
  }

  public setPlatform(platform: platforms): void {
    this._platform = platform
  }

  public setAdblock(block: boolean): void {
    this._adblock = block
  }

  public getAdblock(): boolean {
    return this._adblock
  }

  public setTutorial(tutorial: boolean): void {
    this._tutorial = tutorial
  }

  public getTutorial(): boolean {
    return this._tutorial
  }
}

export default new Settings();