import { MobilePlatform } from "../constants/common/mobilePlatform";

export default function detectMobilePlatform() {
  const userAgent = navigator.userAgent;

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return MobilePlatform.iOS;
  }
  if (/android/i.test(userAgent)) {
    return MobilePlatform.aOS;
  }

  return null;
}
