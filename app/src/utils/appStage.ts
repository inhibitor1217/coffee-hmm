import { AppStage } from "constants/enums/appStage";

export default function appStage(): AppStage {
  const appStage = process.env.NODE_ENV as AppStage;
  return appStage;
}
