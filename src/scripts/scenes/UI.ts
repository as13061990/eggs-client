import UIActions from "../actions/UIActions";
import GoodBooster from "../components/GoodBooster";
import ScoreBooster from "../components/ScoreBooster";
import BadBooster from "../components/BadBooster";

class UI extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  public actions: UIActions = new UIActions(this);
  public goodEggBoost: GoodBooster
  public scoreEggBoost: ScoreBooster
  public badEggBoost: BadBooster
  public score: Phaser.GameObjects.Text

  public create(): void {
    this.actions.build();
  }
}

export default UI;