import bridge, { EAdsFormats } from "@vkontakte/vk-bridge";
import Settings from "../data/Settings";
import { platforms } from "../types/enums";
import HealthBar from "../components/HealthBar";

class Ads {

  public rewardCallback: () => void = () => { }

  public checkReadyAd(): boolean {
    return !Settings.gp.ads.isAdblockEnabled && Settings.gp.ads.isFullscreenAvailable && Settings.gp.ads.isRewardedAvailable
  }

  public showInterstitialAd(): void {
    if (Settings.getPlatform() === platforms.YANDEX) {

      Settings.ysdk.adv.showFullscreenAdv({
        callbacks: {
          onClose: function (wasShown) {
            // some action after close
          },
          onError: function (error) {
            // some action on error
          }
        }
      })
    } else {
      Settings.gp.ads.showFullscreen();
    }
  }

  public async adReward(): Promise<void> {
    if (Settings.getPlatform() === platforms.YANDEX) {
      const success = await Settings.ysdk.adv.showRewardedVideo({
        callbacks: {
          onOpen: () => {
            console.log('Video ad open.');
          },
          onRewarded: () => {
            console.log('Rewarded!');
            this.rewardCallback()
          },
          onClose: () => {
            console.log('Video ad closed.');
          },
          onError: (e) => {
            console.log('Error while open video ad:', e);
          }
        }
      })
    } else {
      const success = await Settings.gp.ads.showRewardedVideo();
      if (success) {
        this.rewardCallback()
      }
    }

  }

}

export default new Ads()