import 'package:mobile_app/util/app_stage.dart';

class Environment {
  static const appName =
      String.fromEnvironment('APP_NAME', defaultValue: 'coffee hmm');

  static const _rawAppStage =
      String.fromEnvironment('APP_STAGE', defaultValue: 'dev');

  static final appStage = AppStageUtil.parse(_rawAppStage);

  static String get apiBaseUrl {
    switch (appStage) {
      case AppStage.development:
      case AppStage.beta:
        return 'https://beta.api.coffee-hmm.inhibitor.io';
      case AppStage.release:
        return 'https://release.api.coffee-hmm.inhibitor.io';
    }
  }
}
