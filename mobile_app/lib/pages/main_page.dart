import 'package:flutter/material.dart';
import 'package:mobile_app/view/cafe_main/main_body_content.dart';
import 'package:mobile_app/view/common/header.dart';

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  /* Main Page has 2 view mode : Slider, Feed */
  bool isFeedViewMode = false;

  void handleViewMode() {
    setState(() {
      isFeedViewMode = !isFeedViewMode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        appBar: MainHeader(
          isFeedViewMode: isFeedViewMode,
          onChangeViewMode: handleViewMode,
        ),
        body: MainBody(isFeedViewMode: isFeedViewMode)
    );
  }
}

