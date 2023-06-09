import bridge, { EAdsFormats } from "@vkontakte/vk-bridge";
import Settings from "../data/Settings";
import { platforms } from "../types/enums";
import HealthBar from "../components/HealthBar";

class Ads {

  public rewardCallback: () => void = () => { }

  public checkReadyAd(): boolean {
    return !gp.ads.isAdblockEnabled && gp.ads.isFullscreenAvailable && gp.ads.isRewardedAvailable
  }

  public showInterstitialAd(): void {
    gp.ads.showFullscreen();
  }

  public async adReward(): Promise<void>{
    const success = await gp.ads.showRewardedVideo();
    if (success) {
      this.rewardCallback()
    }
  }

}

export default new Ads()