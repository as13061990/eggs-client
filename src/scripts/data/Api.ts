import Settings from "./Settings"
import Session from "./Session"
import { platforms } from "../types/enums";
import User from "./User";

class Api {

  public async postRating(): Promise<void> {
    if (Settings.getPlatform() === platforms.YANDEX) {
      if (User.getScore() < Session.getPoints()) {
        Settings.ysdk.getLeaderboards()
          .then(lb => {
            lb.setLeaderboardScore('Top', Session.getPoints());
          });
        User.setScore(Session.getPoints())
      }
    } else {
      if (Settings.gp.player.score < Session.getPoints()) {
        Settings.gp.player.set('score', Session.getPoints());
        Settings.gp.player.sync();
      }
    }
  }

  public async getRatings(): Promise<any> {
    let data
    await Settings.ysdk.getLeaderboards()
      .then(async (lb) => {
        // Получение 10 топов и 3 записей возле пользователя
        await lb.getLeaderboardEntries('Top', { quantityTop: 10, includeUser: true })
          .then(res => data = res);
      })

      .then(res => console.log(res));
    return data 
  }

}

export default new Api();