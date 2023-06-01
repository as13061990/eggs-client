import Session from '../data/Session';
import Boot from '../scenes/Boot';
import Game from '../scenes/Game';

class Interval {
  constructor(scene: Boot) {
    this._scene = scene;
    this.init();
  }

  private _scene: Boot;
  private _loop: Phaser.Time.TimerEvent;

  private init(): void {
    this._loop = this._scene.time.addEvent({ delay: 1000, callback: (): void => {
      console.log('interval')
      this._game()
    }, loop: true });
  }

  private _game(): void {
    if (!this._scene.scene.isActive('Game')) return
    const game = this._scene.game.scene.getScene('Game') as Game;
    Session.scaleDifficulty()
    console.log(Session.getDifficulty(), 'lol') 
  }
}

export default Interval;