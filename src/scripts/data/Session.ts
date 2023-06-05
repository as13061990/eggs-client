import { eggType } from "../types/enums";

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
  }

  public getPoints(): number {
    return this._points
  }

  public plusPoints(number: number): number {
    return this._points += number
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

  public getActiveBooster(type: eggType): boolean {
    switch (type) {
      case (eggType.good):
        return this._isActiveGoodBooster
      case (eggType.bad):
        return this._isActiveBadBooster
      case (eggType.score):
        return this._isActiveScoreBooster
    }
  }

  public setActiveBooster(active: boolean, type: eggType,): void {
    switch (type) {
      case (eggType.good):
        if (active) this._boostTimerGood = BOOST_TIMER
        this._isActiveGoodBooster = active
        break;
      case (eggType.bad):
        if (active) this._boostTimerBad = BOOST_TIMER
        this._isActiveBadBooster = active
        break;
      case (eggType.score):
        if (active) this._boostTimerScore = BOOST_TIMER
        this._isActiveScoreBooster = active
        break;
    }
  }

  public minusBoostTimer(type: eggType): void {
    switch (type) {
      case (eggType.good):
        if (this._boostTimerGood === 0) return
        this._boostTimerGood--
        break;
      case (eggType.bad):
        if (this._boostTimerBad === 0) return
        this._boostTimerBad--
        break;
      case (eggType.score):
        if (this._boostTimerScore === 0) return
        this._boostTimerScore--
        break;
    }
  }

  public resetBoostTimer(type: eggType): void {
    switch (type) {
      case (eggType.good):
        this._boostTimerGood = 0
        break;
      case (eggType.bad):
        this._boostTimerBad = 0
        break;
      case (eggType.score):
        this._boostTimerScore = 0
        break;
    }
  }

  public getBoostTimer(type: eggType): number {
    switch (type) {
      case (eggType.good):
        return this._boostTimerGood
      case (eggType.bad):
        return this._boostTimerBad
      case (eggType.score):
        return this._boostTimerScore
    }
  }

}

export default new Session();