class Session {
  private _points: number = 0
  private _health: number = 3
  private _over: boolean = false;
  private _difficulty: number = 1

  public clear(): void {
    this._points = 0
    this._health = 3
    this._over = false
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
    if (value >= 0.2 && value <= 2) {
      this._difficulty = value
    }
  }



}

export default new Session();