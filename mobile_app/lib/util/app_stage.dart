enum AppStage {
  development,
  beta,
  release,
}

extension AppStageUtil on AppStage {
  static final _defaultValue = AppStage.development;

  static AppStage parse(String value) {
    switch (value) {
      case 'dev':
      case 'development':
      case 'DEV':
      case 'DEVELOPMENT':
      case 'debug':
        return AppStage.development;
      case 'alpha':
      case 'beta':
      case 'ALPHA':
      case 'BETA':
        return AppStage.beta;
      case 'release':
      case 'production':
      case 'prod':
      case 'RELEASE':
      case 'PRODUCTION':
      case 'PROD':
        return AppStage.release;
      default:
        return _defaultValue;
    }
  }

  String get key {
    switch (this) {
      case AppStage.development:
        return 'dev';
      case AppStage.beta:
        return 'beta';
      case AppStage.release:
        return 'release';
    }
  }

  bool get isLocal => this == AppStage.development;

  bool get isProduction => this == AppStage.release;
}
