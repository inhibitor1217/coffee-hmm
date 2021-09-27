import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    let googleMapApiKey = Bundle.main.object(forInfoDictionaryKey: "GOOGLE_MAP_KEY_IOS") as? String
    GMSServices.provideAPIKey(googleMapApiKey)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
