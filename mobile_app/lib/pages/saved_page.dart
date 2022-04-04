import 'package:flutter/material.dart';
import 'package:mobile_app/view/common/header.dart';
import 'package:mobile_app/view/saved/saved_body_content.dart';

class SavedScreen extends StatefulWidget {
  @override
  _SavedScreenState createState() => _SavedScreenState();
}

class _SavedScreenState extends State<SavedScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        appBar: SavedHeader(),
        body: SavedBodyContent()
    );
  }
}