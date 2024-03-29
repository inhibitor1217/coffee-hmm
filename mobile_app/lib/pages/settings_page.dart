import 'package:flutter/material.dart';
import 'package:mobile_app/view/common/header.dart';
import 'package:package_info_plus/package_info_plus.dart';

class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: BaseHeader(), body: SettingsBody());
  }
}

class SettingsBody extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<PackageInfo>(
        future: PackageInfo.fromPlatform(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return Container();
          }

          return ListView(
            children: [
              ListTile(
                title: Text('앱 버전'),
                subtitle: Text(snapshot.data!.version),
              ),
              ListTile(
                title: Text('빌드 번호'),
                subtitle: Text(snapshot.data!.buildNumber),
              ),
            ],
          );
        });
  }
}
