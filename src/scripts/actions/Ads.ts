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
              console.log(this._readyAd,'1')
            }
          })
        break;
    }
  }

  public showInterstitialAd(): void {
    this.checkReadyAd()
    Settings.sounds.mute()
    if (this._readyAd) {
      switch (Settings.getPlatform()) {
        case platforms.VK:
          bridge.send("VKWebAppShowNativeAds", { ad_format: EAdsFormats.INTERSTITIAL })
          .then((data)=>Settings.sounds.unmute())
          .catch(e =>Settings.sounds.unmute())
          break;
      }
    }
  }

  public adReward(): void {
    this.checkReadyAd()
    Settings.sounds.mute()
    if (this._readyAd) {
      switch (Settings.getPlatform()) {
        case platforms.VK:
          bridge.send("VKWebAppShowNativeAds", { ad_format: EAdsFormats.REWARD })
            .then((data) => {
              if (data.result) {
                Settings.sounds.unmute()
                this.rewardCallback()
              }
            })
            .catch(e => Settings.sounds.unmute())
          break;
      }
    }
  }

  public getReadyAd(): boolean {
    return this._readyAd
  }
}

export default new Ads()