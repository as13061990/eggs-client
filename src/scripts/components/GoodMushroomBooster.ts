import Game from "../scenes/Game";
import UI from "../scenes/UI";

class GoodMushroomBooster extends Phaser.GameObjects.Sprite {
  constructor(scene: UI) {
    super(scene, 1, 1, 'egg-good')
  }
}