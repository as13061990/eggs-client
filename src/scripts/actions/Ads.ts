import bridge, { EAdsFormats } from "@vkontakte/vk-bridge";
import Settings from "../data/Settings";
import { platforms } from "../types/enums";

class Ads {

  private _readyAd: boolean = false 

  private _checkReadyAd(type: 'reward' | 'interstitial'): void {
    if (!Settings.getAdblock()) {
      switch (Settings.getPlatform()) {
        case platforms.VK:
          bridge.send('VKWebAppCheckNativeAds', {ad_format: type === 'interstitial' ? EAdsFormats.INTERSTITIAL : EAdsFormats.REWARD})
          .then((data) => {
            if (data.result) {
              this._readyAd = true
            }
          })
          break;
      }
    } else {
      this._readyAd = false
    }
  }
  public showInterstitialAd(): void {
    this._checkReadyAd('interstitial')
    if (this._readyAd) {
      switch (Settings.getPlatform()) {
        case platforms.VK:
          bridge.send("VKWebAppShowNativeAds", { ad_format: EAdsFormats.INTERSTITIAL }).catch(e => console.log(e))
          break;
      }
    }
  }

  public adReward(): void {
  }
}

export default new Ads()