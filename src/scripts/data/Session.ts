import { boosterType } from "../types/enums";

const DIFFICULTY_SCALE = 0.01
const DIFFICULTY_SCALE_MEDIUM = 0.005
const BOOST_TIMER = 10

class Session {
  private _points: number = 0
  private _health: number = 3
  private _over: boolean = false;
  private _difficulty: number = 1.5
  private _watchedRewardAd: boolean = false
  private _watchedAds: number = 3
  private _bg: number = 1
  private _isActiveGoodBooster: boolean = false
  private _isActiveBadBooster: boolean = false
  private _isActiveScoreBooster: boolean = false
  private _positions: number[] = [0,0,0]
  private _boostTimerScore: number = 0
  private _boostTimerGood: number = 0
  private _boostTimerBad: number = 0

  public clear(): void {
    this._difficulty = 2
    this._points = 0
    this._health = 3
    this._over = false
    this._watchedRewardAd = false
    this._watchedAds = 3
    this._isActiveGoodBooster = false
    this._isActiveBadBooster = false
    this._isActiveScoreBooster = false
    this._positions = [0,0,0]
  }

  public getPoints(): number {
    return this._points
  }

  public plusPoints(number: number): number {
    let scale = 1
    if (this._isActiveScoreBooster) scale = 2
    return this._points += number * scale
  }

  public getHealth(): number {
    return this._health
  }

  public minusHealth(): number {
    if (this._health === 0) return
    return this._health -= 1
  }

  public plusHealth(): number {
    if (this._health === 3) return
    return this._health += 1
  }

  public getOver(): boolean {
    return this._over
  }

  public setOver(over: boolean): void {
    this._over = over
  }

  public getDifficulty(): number {
    return this._difficulty
  }

  public setDifficulty(value: number): void {
    if (value >= 0.5 && value <= 2) {
      this._difficulty = value
    }
  }

  public scaleDifficulty(): void {
    if (this._difficulty >= 0.5 && this._difficulty <= 2) {
      if (this._difficulty >= 0.8 && this._difficulty <= 1.5) {
        this._difficulty -= DIFFICULTY_SCALE_MEDIUM
      } else {
        this._difficulty -= DIFFICULTY_SCALE
      }
    }

  }

  public getBg(): number {
    return this._bg
  }

  public setBg(value: number): void {
    this._bg = value
  }

  public setWatchedRewardAd(watched: boolean): void {
    this._watchedRewardAd = watched
  }

  public getWatchedRewardAd(): boolean {
    return this._watchedRewardAd
  }

  public getWatchedAds(): number {
    return this._watchedAds
  }

  public minusWatchedAds(): void {
    if (this._watchedAds === 0) return
    this._watchedAds -= 1
  }

  public getActiveBooster(type: boosterType): boolean {
    switch (type) {
      case (boosterType.good):
        return this._isActiveGoodBooster
      case (boosterType.bad):
        return this._isActiveBadBooster
      case (boosterType.score):
        return this._isActiveScoreBooster
    }
  }

  public setActiveBooster(active: boolean, type: boosterType,): void {
    switch (type) {
      case (boosterType.good):
        if (active) this._boostTimerGood = BOOST_TIMER
        this._isActiveGoodBooster = active
        break;
      case (boosterType.bad):
        if (active) this._boostTimerBad = BOOST_TIMER
        this._isActiveBadBooster = active
        break;
      case (boosterType.score):
        if (active) this._boostTimerScore = BOOST_TIMER
        this._isActiveScoreBooster = active
        break;
    }
  }

  public minusBoostTimer(type: boosterType): void {
    switch (type) {
      case (boosterType.good):
        if (this._boostTimerGood === 0) return
        this._boostTimerGood--
        break;
      case (boosterType.bad):
        if (this._boostTimerBad === 0) return
        this._boostTimerBad--
        break;
      case (boosterType.score):
        if (this._boostTimerScore === 0) return
        this._boostTimerScore--
        break;
    }
  }

  public resetBoostTimer(type: boosterType): void {
    switch (type) {
      case (boosterType.good):
        this._boostTimerGood = 0
        break;
      case (boosterType.bad):
        this._boostTimerBad = 0
        break;
      case (boosterType.score):
        this._boostTimerScore = 0
        break;
    }
  }

  public getBoostTimer(type: boosterType): number {
    switch (type) {
      case (boosterType.good):
        return this._boostTimerGood
      case (boosterType.bad):
        return this._boostTimerBad
      case (boosterType.score):
        return this._boostTimerScore
    }
  }

  public setPosition(): number {
    let position
    for (let i = 0; i < this._positions.length; i++) {
      if (this._positions[i] === 0) {
        this._positions[i] = 1
        position = i
        break;
      }
    }
    console.log(position)
    return position
  }

  public clearPosition(index): void {
    this._positions[index] = 0
  }

}

export default new Session();