class Session {
  private _points: number = 0

  public clear(): void {
    this._points = 0
  }

  public getPoints(): number {
    return this._points
  }

  public plusPoints(number: number): number {
    return this._points += number
  }
}

export default new Session();