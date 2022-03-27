# Release Steps 🚀

## iOS 📱
### build & distribute
1. git pull `master` branch latest
2. run script `flutter build ipa --release --dart-define APP_STAGE=release`
3. open `coffee-hmm/mobile_app/build/ios/archive/Runner.xcarchive` in Xcode
4. [Distribute App] > [App Store Connect] > [Upload]
5. certify [coffeehmm.mobileprovision]
4. click [Upload]

## developer test
6. Test Flight

### submit
7. add new version in [app-store-connect webpage](https://appstoreconnect.apple.com/apps)
8. click [심사에 추가]

<br/>
<br/>

## aOS 📱
### developer test
1. git action `release-mobile@beta` run workflow branch `[test-version-branch]` from `master`
2. after git action finished output file will be sent to Slack #webhook
3. download apk file

### build
1. git action `release-mobile` run workflow branch `master` from `master`
2. after git action finished output file will be sent to Slack #webhook
3. download `app-release.aab`

### submit
4. 테스트 > 비공개 테스트 > 트랙 관리
5. [새 버전 추가]
6. upload `app-release.aab` bundle
7. save and click [버전 검토]
