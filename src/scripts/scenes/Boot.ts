import axios from 'axios';
//@ts-ignore
import * as Webfont from 'webfontloader';
import loading from '../../assets/images/loading.png';
import Interval from '../actions/Interval';
import Sounds from '../actions/Sounds';
import Settings from '../data/Settings';
import User from '../data/User';
import { platforms } from '../types/enums';

class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  private _fonts: boolean = false;
  private _user: boolean = false;

  public init(): void {
    Webfont.load({
      custom: {
        families: ['Triomphe']
      },
      active: (): void => {
        this._fonts = true;
      }
    });
    Settings.sounds = new Sounds(this);
    Settings.interval = new Interval(this);

    const search: string = window.location.search;
    const params = new URLSearchParams(search);
    const vk: string = params.get('api_url');

    if (vk === 'https://api.vk.com/api.php') Settings.setPlatform(platforms.VK)

    const platform = Settings.getPlatform()

    if (platform === platforms.VK) {
      this._initUserVK();
    } else {
      this._initUserWeb();
    }

    this._checkUser();
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

  private async _checkUser(): Promise<void> {

    try { User.setID('0'); }
    catch (e) { User.setID('0'); }
    
    try { User.setUsername('username'); }
    catch (e) { User.setUsername('username'); }

    try { User.setFirstName('noname'); }
    catch (e) { User.setFirstName('noname'); }
    
    try { User.setLastName(''); }
    catch (e) { User.setLastName(''); }

    // await axios.post(process.env.API + '/getData', {
    //   id: User.getID(),
    //   username: User.getUsername(),
    //   first_name: User.getFirstName(),
    //   last_name: User.getLastName()
    // }).then(res => {
    //   if (!res.data.error) {

    //   }
    // }).catch(e => console.log(e));
    this._user = true;
  }

  private _initUserVK(): void {

  }

  private _initUserWeb(): void {

  }
}

export default Boot;