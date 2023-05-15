import Boot from '../scenes/Boot';

class Interval {
  constructor(scene: Boot) {
    this._scene = scene;
    this.init();
  }

  private _scene: Boot;
  private _loop: Phaser.Time.TimerEvent;

  private init(): void {
    this._loop = this._scene.time.addEvent({ delay: 1000, callback: (): void => {

    }, loop: true });
  }
}

export default Interval;