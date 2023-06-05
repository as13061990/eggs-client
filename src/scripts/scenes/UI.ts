import axios from "axios";
import Button from "../components/Button";
import HealthBar from "../components/HealthBar";
import Modal from "../components/Modal";
import Session from "../data/Session";
import Settings from "../data/Settings";
import { platforms, screen } from "../types/enums";
import Game from "./Game";
import User from "../data/User";
import Rating from "../screen/Rating";
import RewardLifeAd from "../screen/RewardLifeAd";
import Ads from "../actions/Ads";
import Egg from "../components/Egg";
import Zone from "../components/Zone";
import { Scene } from "phaser";
import UIActions from "../actions/UIActions";
import GoodMushroomBooster from "../components/GoodMushroomBooster";

class UI extends Phaser.Scene {
  constructor() {
    super('UI');
  }

  public actions: UIActions = new UIActions(this);
  public goodEggBoost: GoodMushroomBooster
  public score: Phaser.GameObjects.Text

  public create(): void {
    this.actions.build();
  }
}

export default UI;