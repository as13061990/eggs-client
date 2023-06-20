type initialization = {
  token: string
  server: string
  id?: string | number
  source?: string
  platform?: string
}
type initData = {
  id: string | number
  source: string
  platform: string
}
type trackData = {
  event: string
  props?: any
  session: number
  id: number
}
type revenueData = {
  amount: number
  session: number
  id: number
}
type revenueEvent = {
  amount: number
}
type response = {
  data: any
  error: boolean
  error_type: number
}

class Analytics {

  private _init: boolean = false
  private _token: string
  private _server: string
  private _session: number
  private _localID: string
  private _id: number
  
  public async init({ token, server, id, source, platform }: initialization): Promise<void> {
    this._token = token
    this._server = server
    const data: initData = {
      id: !id ? this._getLocalUserID() : id,
      source,
      platform
    }
    await this._request('init', data).then((res: response): void => {
      if (res.error === false) {
        this._init = true
        this._id = res.data.id
        this._session = res.data.session
        console.log('[SKORIT Analytics] Success connection')
      } else {
        console.warn('[SKORIT Analytics] Rejected connection')
      }
    })
  }

  public track(event: string, props: string): void {
    if (!this._init) return
    const data: trackData = {
      event: event.toLocaleLowerCase(),
      props: JSON.stringify(props),
      session: this._session,
      id: this._id
    }
    this._request('track', data)
  }

  public revenue({ amount }: revenueEvent): void {
    if (!this._init) return
    const data: revenueData = {
      amount: amount,
      session: this._session,
      id: this._id
    }
    this._request('revenue', data)
  }

  private async _request<T>(route: string, data: initData | revenueData | trackData): Promise<T> {
    return fetch(this._server + '/' + route, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this._token
      },
      body: JSON.stringify(data)
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<T>
    })
  }

  private _getLocalUserID(): string {
    if (this._isLocalStorageAvailable()) {
      this._localID = localStorage.getItem('SKORIT_Analytics_ID')

      if (!this._localID) {
        this._localID = new Date().getTime() +  '_' + this._random(10000, 99999)
        localStorage.setItem('SKORIT_Analytics_ID', this._localID)
      }
      return this._localID
    } else {
      const data: trackData = {
        event: 'localStorage is unavailable',
        session: null,
        id: null
      }
      this._request('log', data)
      console.warn('[SKORIT Analytics] localStorage is unavailable')
    }
  }

  private _random(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min)
  }

  private _isLocalStorageAvailable(): boolean {
    try {
      const test = 'test'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch(e) {
      return false
    }
  }
}

export default new Analytics()