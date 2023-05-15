class Analytics {

  _init = false
  _token
  _server
  _session
  _localID
  _id
  
  init({ token, server, id, source, platform }) {
    this._token = token
    this._server = server
    const data = {
      id: !id ? this._getLocalUserID() : id,
      source,
      platform
    }
    this._request('init', data).then(res => {
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

  track({ event, props }) {
    if (!this._init) return
    const data = {
      event: event.toLocaleLowerCase(),
      props: JSON.stringify(props),
      session: this._session,
      id: this._id
    }
    this._request('track', data)
  }

  revenue({ amount }) {
    if (!this._init) return
    const data = {
      amount: amount,
      session: this._session,
      id: this._id
    }
    this._request('revenue', data)
  }

  async _request(route, data) {
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
      return response.json()
    })
  }

  _getLocalUserID() {
    if (this._isLocalStorageAvailable()) {
      this._localID = localStorage.getItem('SKORIT_Analytics_ID')

      if (!this._localID) {
        this._localID = new Date().getTime() +  '_' + this._random(10000, 99999)
        localStorage.setItem('SKORIT_Analytics_ID', this._localID)
      }
      return this._localID
    } else {
      const data = {
        event: 'localStorage is unavailable',
        session: null,
        id: null
      }
      this._request('log', data)
      console.warn('[SKORIT Analytics] localStorage is unavailable')
    }
  }

  _random(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

  _isLocalStorageAvailable() {
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
// window.Analytics = new Analytics()
export default new Analytics()