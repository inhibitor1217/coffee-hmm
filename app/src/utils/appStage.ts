import { AppStage } from "constants/common";

export default function appStage(): AppStage {
  const appStage = process.env.NODE_ENV as AppStage;
  return appStage;
}
