import axios from 'axios';
import UI from '../scenes/Menu';

class Rating {
  constructor(scene: UI) {
    this._scene = scene;
    this._build();
  }

  private _scene: UI;
  private _users: any[];

  private _build(): void {
    const { width, height } = this._scene.cameras.main;
    const background = this._scene.add.sprite(width / 2, height / 2, 'bg');
    background.setOrigin(0.5);

    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);

    this._getRatings()
  }

  private async _getRatings(): Promise<void> {
    await axios.get(process.env.API + '/rating/top')
      .then((response) => {
        this._users = response.data
        this._buildRating()
      })
  }

  private _buildRating(): void {
    const { centerX, centerY } = this._scene.cameras.main;
    this._users.forEach((user, i) => {
      this._scene.add.text(centerX, centerY - 300 + 50 * i, (user?.name + ' ' + user?.score).toUpperCase(), {
        color: 'white',
        font: '36px EpilepsySans',
      }).setOrigin(.5, .6).setDepth(11);
    })
  }

}

export default Rating;