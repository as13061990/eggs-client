import axios from "axios"
import Settings from "./Settings"
import User from "./User"
import { platforms } from "../types/enums"
import Session from "./Session"

class Api {


  public async postCheckUser(): Promise<boolean> {
    return axios.post(process.env.API + '/user/check', {
      platform: Settings.getPlatform(),
      id: User.getID(),
      name: User.getUsername(),
    }).then((response) => {
      if (response.data?.data?.user?.score) User.setScore(response.data?.data?.user?.score)
      else User.setScore(0)
      return true
    }).catch(() => {
      Settings.setPlatform(platforms.WEB)
      return true
    })
  }

  public async getRatings(): Promise<IgetRatings> {
    let users, user
    await axios.post(process.env.API + '/rating/top', { id: User.getID(), platform: Settings.getPlatform() })
      .then((response) => {
        if (response.data.error) {
          users = [{ name: 'Анонимус', score: 200 }]
        } else {
          users = response?.data?.data?.users
          user = response?.data?.data?.user
        }
      })
      .catch((e) => console.log(e))
    return { users, user }
  }

  public async postRating(): Promise<void> {
    if ( Settings.gp.player.score < Session.getPoints()) {
       Settings.gp.player.set('score', Session.getPoints());
       Settings.gp.player.sync();
    }
    // if (Settings.getPlatform() !== platforms.WEB) {
    //   await axios.post(process.env.API + '/rating/post', {
    //     platform: Settings.getPlatform(),
    //     id: User.getID(),
    //     score: Session.getPoints(),
    //   })
    //     .catch((e) => console.log(e))
    // } else {
    //   if (User.getScore() < Session.getPoints()) {
    //     localStorage.setItem('score', String(Session.getPoints()));
    //   }
    // }
  }

}

export default new Api();