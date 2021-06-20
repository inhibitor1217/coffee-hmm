import { AppStage } from "../constants/enums/appStage";

export function appStage(): AppStage {
  const appStage = process.env.NODE_ENV as AppStage;
  return appStage;
}
