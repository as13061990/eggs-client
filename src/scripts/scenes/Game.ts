import GameActions from '../actions/GameActions';
import Loading from '../components/Loading';
import Player from '../components/Player';

class Game extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  public actions: GameActions = new GameActions(this);
  public player: Player;
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
    this.scene.launch('Menu');
  }
}

export default Game;