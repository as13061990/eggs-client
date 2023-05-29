import axios from 'axios';
import Button from '../components/Button';
import Settings from '../data/Settings';
import { screen } from '../types/enums';
import User from '../data/User';
import UI from '../scenes/UI';

class Rating {
  constructor(scene: Phaser.Scene, isUIScene?: boolean) {
    this._scene = scene;
    this._isUIScene = isUIScene
    this._build();
  }

  private _isUIScene: boolean = false
  private _scene: Phaser.Scene;
  private _users: any[];
  private _userScore: { score: number, place: number } = { score: null, place: null };
  private _modal: Phaser.GameObjects.Sprite
  private _elements: (Phaser.GameObjects.Sprite | Phaser.GameObjects.Text)[] = []

  private _build(): void {
    const { width, height, centerX, centerY } = this._scene.cameras.main;
    const background = this._scene.add.sprite(width / 2, height, 'bg');
    background.setOrigin(0.5, 1).setDepth(21);

    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);
    this._modal = this._scene.add.sprite(centerX, centerY, 'modal')
    this._modal.setDisplaySize(this._modal.width * 3, this._modal.height * 2.5).setDepth(21)
    this._elements.push(background, this._modal)
    this._getRatings()
  }

  private async _getRatings(): Promise<void> {
    await axios.post(process.env.API + '/rating/top', { id: User.getID(), platform: Settings.getPlatform() })
      .then((response) => {
        console.log(response.data)
        if (response.data.error) {
          this._users = [{ name: 'Анонимус', score: 200 }]
        } else {
          this._users = response?.data?.data?.users
          this._userScore = response?.data?.data?.user
        }
        this._buildModalRating()
      })
  }

  private _buildModalRating(): void {
    const { centerX } = this._scene.cameras.main;
    const title = this._scene.add.text(centerX, this._modal.getBounds().top + 50, ('Рейтинг').toUpperCase(), {
      color: 'black',
      font: '48px EpilepsySansBold',
    }).setOrigin(.5, .6).setDepth(21);
    this._elements.push(title)

    this._users.forEach((user, i) => {
      const name = this._scene.add.text(
        this._modal.getBounds().left + 20,
        this._modal.getBounds().top + 100 + 60 * (i + 1),
        (i + 1 + ". " + user?.name).toUpperCase(),
        {
          align: 'left',
          color: 'black',
          font: i + 1 === this._userScore.place ? '48px EpilepsySansBold' : '48px EpilepsySans',
        }
      ).setOrigin(0, .5).setDepth(21);
      const score = this._scene.add.text(
        this._modal.getBounds().right - 20,
        this._modal.getBounds().top + 100 + 60 * (i + 1),
        ((user?.score).toString()).toUpperCase(),
        {
          align: 'left',
          color: 'rgb(155,50,47)',
          font: i + 1 === this._userScore.place ? '48px EpilepsySansBold' : '48px EpilepsySans',
        }
      ).setOrigin(1, .5).setDepth(21);

      this._elements.push(name, score)
    })

    if (this._userScore?.place > this._users?.length) {
      const name = this._scene.add.text(
        this._modal.getBounds().left + 20,
        this._modal.getBounds().top + 100 + 60 * 11,
        (this._userScore.place + '. ' + User.getUsername()).toUpperCase(),
        {
          align: 'left',
          color: 'black',
          font: '48px EpilepsySansBold',
        }
      ).setOrigin(0, .5).setDepth(21);
      const score = this._scene.add.text(
        this._modal.getBounds().right - 20,
        this._modal.getBounds().top + 100 + 60 * 11,
        (this._userScore.score.toString()).toUpperCase(),
        {
          color: 'rgb(155,50,47)',
          font: '48px EpilepsySansBold',
        }
      ).setOrigin(1, .5).setDepth(21);
      this._elements.push(name, score)
    }

    const btn = new Button(this._scene, centerX, this._modal.getBounds().bottom - 80, 'button-red-def').setDepth(21)
    btn.text = this._scene.add.text(btn.x, btn.y, ('Назад').toUpperCase(), {
      color: 'white',
      font: '36px EpilepsySans'
    }).setOrigin(.5, .6).setDepth(21);
    btn.callback = this.back.bind(this)
    this._elements.push(btn)
  }

  public back(): void {
    if (this._isUIScene) {
      this._elements.forEach(el => {
        el.destroy()
      })
      const sceneUI = this._scene as UI
      sceneUI.actions.activeInteractiveBtns()
      sceneUI.actions.setActiveScreen(null)
    } else {
      Settings.setScreen(screen.MAIN);
      this._scene.scene.restart();
    }
  }

}

export default Rating;