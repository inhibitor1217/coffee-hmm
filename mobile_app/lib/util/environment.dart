import 'package:mobile_app/util/app_stage.dart';

class Environment {
  static const appName =
      String.fromEnvironment('APP_NAME', defaultValue: 'coffee hmm');

  static final appStage = AppStageUtil.parse(
      String.fromEnvironment('APP_STAGE', defaultValue: 'dev'));
}
