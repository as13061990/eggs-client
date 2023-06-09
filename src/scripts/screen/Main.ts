import Modal from '../components/Modal';
import Settings from '../data/Settings';
import UI from '../scenes/Menu';
import { screen } from '../types/enums';

class Main {
  constructor(scene: UI) {
    this._scene = scene;
    this._build();
  }

  private _scene: UI;
  private _modal: Modal

  private _build(): void {
    const { width, height } = this._scene.cameras.main;
    const background = this._scene.add.sprite(width / 2, height, 'bg');
    background.setOrigin(0.5, 1);

    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);

    this._modal = new Modal(this._scene, 'button-green-def', 'button-blue-def')

    this._modal.setTextBtn('first', 'Играть')
    this._modal.setTextBtn('second', 'Рейтинг')

    this._modal.btnFirst.callback = (): void => this._play()
    if (this._modal.btnSecond) {
      this._modal.btnSecond.callback = (): void => {
        try {
          gp.leaderboard.open({
            // Сортировка по полям слева направо
            orderBy: ['score',],
            // Сортировка DESC — сначала большие значение, ASC — сначала маленькие
            order: 'DESC',
            // Количество игроков в списке
            limit: 10,
            // Включить список полей для отображения в таблице, помимо orderBy
            includeFields: ['score'],
            // Вывести только нужные поля по очереди
            displayFields: ['rank', 'score'],
            withMe: 'last'
          });
        } catch (e) {
          console.log(e)
        }
      }
    }

    Settings.sounds.playMusic('bg')

    console.log(// ID
      gp.player.id,
      gp.player.score,
      // Имя
      gp.player.name,
      // Ссылка на аватар
      gp.player.avatar,
      // Заглушка — пустой ли игрок или данные в нём отличаются умолчательных
      gp.player.isStub,
      // Поля игрока
      gp.player.fields)
    console.log(gp.player.isLoggedIn)

  }

  private _play(): void {
    if (Settings.getTutorial()) {
      Settings.setScreen(screen.BOOSTER)
      this._scene.scene.restart()
    } else {
      this._scene.scene.start('Game');
    }
  }
}

export default Main;