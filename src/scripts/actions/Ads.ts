import bridge, { EAdsFormats } from "@vkontakte/vk-bridge";
import Settings from "../data/Settings";
import { platforms } from "../types/enums";
import HealthBar from "../components/HealthBar";

class Ads {

  public rewardCallback: () => void = () => { }

  public checkReadyAd(): boolean {
    console.log(Settings.gp.ads.isAdblockEnabled, 'isAdblockEnabled')
    return !Settings.gp.ads.isAdblockEnabled &&  Settings.gp.ads.isFullscreenAvailable &&  Settings.gp.ads.isRewardedAvailable
  }

  public showInterstitialAd(): void {
     Settings.gp.ads.showFullscreen();
  }

  public async adReward(): Promise<void>{
    const success = await  Settings.gp.ads.showRewardedVideo();
    if (success) {
      this.rewardCallback()
    }
  }

}

export default new Ads()