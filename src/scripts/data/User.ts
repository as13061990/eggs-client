import { platforms } from "../types/enums";
import Settings from "./Settings";

class User {

  private _vkId: number;
  private _yaId: number;
  private _username: string;
  private _firstname: string;
  private _lastname: string;
  private _score: number = 0;


  public getID(): number {
    switch (Settings.getPlatform()) {
      case platforms.VK:
        return this._vkId;
      case platforms.YANDEX:
        return this._yaId;
    }
  }

  public setVKID(id: number): void {
    this._vkId = id;
  }

  public setYAID(id: number): void {
    this._yaId = id;
  }

  public setUsername(username: string): void {
    this._username = username;
  }

  public getUsername(): string {
    return this._username;
  }

  public setFirstName(firstname: string): void {
    this._firstname = firstname;
  }

  public getFirstName(): string {
    return this._firstname;
  }

  public setLastName(lastname: string): void {
    this._lastname = lastname;
  }

  public getLastName(): string {
    return this._lastname;
  }

  public getScore(): number {
    if (Settings.getPlatform() === platforms.YANDEX) {
      return this._score
    } else {
      return Settings.gp.player.score;
    }
  }

  public setScore(score: number): void {
    this._score = score;
  }
}

export default new User();