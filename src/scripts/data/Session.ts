const DIFFICULTY_SCALE = 0.01
const DIFFICULTY_SCALE_MEDIUM = 0.005
class Session {
  private _points: number = 0
  private _health: number = 3
  private _over: boolean = false;
  private _difficulty: number = 2
  private _watchedRewardAd: boolean = false
  private _watchedAds: number = 3
  private _bg: number = 1

  public clear(): void {
    this._difficulty = 2
    this._points = 0
    this._health = 3
    this._over = false
    this._watchedRewardAd = false
    this._watchedAds = 3
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

}

export default new Session();