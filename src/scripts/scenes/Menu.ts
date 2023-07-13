import Loading from '../components/Loading';
import Settings from '../data/Settings';
import BoosterInfo from '../screen/BoosterInfo';
import Main from '../screen/Main';
import Rating from '../screen/Rating';
import { screen } from '../types/enums';

class Menu extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  private _loading: boolean = false;

  public preload(): void {
    if (this._loading === false) {
      this._loading = true;
      new Loading(this);
    }
  }

  public create(): void {
    if (Settings.getScreen() === screen.MAIN) {
      new Main(this)
    } else if (Settings.getScreen() === screen.BOOSTER) {
      new BoosterInfo(this)
    } else if (Settings.getScreen() === screen.RATING) {
      new Rating(this)
    }
  }

  public setGradient(text: Phaser.GameObjects.Text): void {
    const gradient = text.context.createLinearGradient(0, 0, text.width, text.height);
    gradient.addColorStop(0, '#9A6AEA');
    gradient.addColorStop(.2, '#75EEFE');
    gradient.addColorStop(.5, '#F7BA80');
    gradient.addColorStop(1, '#AF1572');
    text.setFill(gradient);
  }

  public move(object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text, target: Iposition = null): void {
    const { centerX, centerY } = this.cameras.main;
    const x = target ? target.x : centerX;
    const y = target ? target.y : centerY;
    const log = (object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text): void => {
      console.clear();
      console.log({
        x: x - object.x,
        y: y - object.y
      });
    }

    const cursors = this.input.keyboard.createCursorKeys();
    cursors.left.on('down', (): void => {
      object.x -= 1;
      log(object);
    });
    cursors.right.on('down', (): void => {
      object.x += 1;
      log(object);
    });
    cursors.up.on('down', (): void => {
      object.y -= 1;
      log(object);
    });
    cursors.down.on('down', (): void => {
      object.y += 1;
      log(object);
    });

    object.setInteractive();
    this.input.setDraggable(object);
    this.input.on('drag', (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text, dragX: number, dragY: number): void => {
      object.x = Math.round(dragX);
      object.y =  Math.round(dragY);
    });
    this.input.on('dragend', (pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Sprite | Phaser.GameObjects.Text): void => {
      log(object);
    });
  }
}

export default Menu;