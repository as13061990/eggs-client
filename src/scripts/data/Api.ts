import Settings from "./Settings"
import Session from "./Session"

class Api {

  public async postRating(): Promise<void> {
    if ( Settings.gp.player.score < Session.getPoints()) {
       Settings.gp.player.set('score', Session.getPoints());
       Settings.gp.player.sync();
    }
  }

}

export default new Api();