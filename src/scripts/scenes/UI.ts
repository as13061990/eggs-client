import UIActions from "../actions/UIActions";
import GoodBooster from "../components/GoodBooster";
import ScoreBooster from "../components/ScoreBooster";
import BadBooster from "../components/BadBooster";
import Modal from "../components/Modal";
import HealthBar from "../components/HealthBar";
import Button from "../components/Button";
import Rating from "../screen/Rating";

interface IPauseElements {
  bg: Phaser.GameObjects.TileSprite
  modal: Modal
}


class UI extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  public actions: UIActions = new UIActions(this);
  public goodEggBoost: GoodBooster
  public scoreEggBoost: ScoreBooster
  public badEggBoost: BadBooster
  public score: Phaser.GameObjects.Text
  public pauseMobileBtn: Button
  public pauseElements: IPauseElements = { bg: null, modal: null }
  public boosterInfo: Phaser.GameObjects.Text
  public health: HealthBar
  public activeScreen: Rating = null

  public create(): void {
    this.actions.build();
  }
}

export default UI;