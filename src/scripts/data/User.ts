import { platforms } from "../types/enums";
import Settings from "./Settings";

class User {

  private _id: string;
  private _vkId: number;
  private _username: string;
  private _firstname: string;
  private _lastname: string;

  public setID(id: string): void {
    this._id = id;
  }

  public getID(): string | number {
    switch(Settings.getPlatform()) {
      case platforms.VK:
        return this._vkId;
      case platforms.WEB:
        return this._id
    }
  }

  public setVKID(id: number): void {
    this._vkId = id;
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
}

export default new User();