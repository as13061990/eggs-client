import bridge, { EAdsFormats } from "@vkontakte/vk-bridge";
import Settings from "../data/Settings";
import { platforms } from "../types/enums";
import HealthBar from "../components/HealthBar";

class Ads {

  private _readyAd: boolean = false
  public rewardCallback: () => void = () => { }

  public checkReadyAd(): void {
    switch (Settings.getPlatform()) {
      case platforms.VK:
        bridge.send('VKWebAppCheckNativeAds', { ad_format: EAdsFormats.INTERSTITIAL })
          .then((data) => {
            if (data.result) {
              this._readyAd = true
              console.log(this._readyAd, '1')
            }
          })
        break;
    }
  }

  public showInterstitialAd(): void {
    this.checkReadyAd()
    const musicUnMute = Settings.sounds.getVolume() === 1
    Settings.sounds.mute()
    if (this._readyAd) {
      switch (Settings.getPlatform()) {
        case platforms.VK:
          bridge.send("VKWebAppShowNativeAds", { ad_format: EAdsFormats.INTERSTITIAL })
            .then((data) => musicUnMute ? Settings.sounds.unmute() : Settings.sounds.mute())
            .catch(e => musicUnMute ? Settings.sounds.unmute() : Settings.sounds.mute())
          break;
      }
    }
  }

  public adReward(): void {
    this.checkReadyAd()
    const musicUnMute = Settings.sounds.getVolume() === 1
    Settings.sounds.mute()
    if (this._readyAd) {
      switch (Settings.getPlatform()) {
        case platforms.VK:
          bridge.send("VKWebAppShowNativeAds", { ad_format: EAdsFormats.REWARD })
            .then((data) => {
              if (data.result) {
                musicUnMute ? Settings.sounds.unmute() : Settings.sounds.mute()
                this.rewardCallback()
              }
            })
            .catch(e => musicUnMute ? Settings.sounds.unmute() : Settings.sounds.mute())
          break;
      }
    }
  }

  public getReadyAd(): boolean {
    return this._readyAd
  }
}

export default new Ads()