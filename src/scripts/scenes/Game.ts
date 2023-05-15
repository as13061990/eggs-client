import GameActions from '../actions/GameActions';
import Loading from '../components/Loading';

class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  public actions: GameActions = new GameActions(this);
  public player: Phaser.GameObjects.Sprite;
  public platform: Phaser.GameObjects.TileSprite;
  public eggs: Phaser.Physics.Arcade.Group
  private _loading: boolean = false;

  public init(): void {
    console.log('init');
    // Session.clear();
  }

  public preload(): void {
    console.log('preload');
    if (this._loading === false) {
      this._loading = true;
      new Loading(this);
    }
  }

  public create(): void {
    this.actions.build();
  }
}

export default Game;