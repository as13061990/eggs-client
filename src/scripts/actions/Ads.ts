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
            }
          })
        break;
    }
  }

  public showInterstitialAd(): void {
    this.checkReadyAd()
    if (this._readyAd) {
      switch (Settings.getPlatform()) {
        case platforms.VK:
          bridge.send("VKWebAppShowNativeAds", { ad_format: EAdsFormats.INTERSTITIAL }).catch(e => console.log(e))
          break;
      }
    }
  }

  public adReward(): void {
    this.checkReadyAd()

    if (this._readyAd) {
      switch (Settings.getPlatform()) {
        case platforms.VK:
          bridge.send("VKWebAppShowNativeAds", { ad_format: EAdsFormats.REWARD })
            .then((data) => {
              if (data.result) {
                console.log('reward')
                this.rewardCallback()
              }
            })
            .catch(e => console.log(e))
          break;
      }
    }
  }

  public getReadyAd(): boolean {
    return this._readyAd
  }
}

export default new Ads()