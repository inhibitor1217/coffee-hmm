import { MobilePlatform } from "../constants/common/mobilePlatform";
import detectMobilePlatform from "./detectMobilePlatform";

export default function openApplicationStore() {
  const platform = detectMobilePlatform();

  if (platform === MobilePlatform.aOS) {
    window.open(
      "http://play.google.com/store/apps/details?id=com.coffeehmm.mobile_app",
    );
    return;
  }
  window.open("https://apps.apple.com/app/id1582353861");
  return;
}
