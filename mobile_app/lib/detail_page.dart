import 'package:flutter/material.dart';
import 'package:mobile_app/header.dart';
import 'package:mobile_app/type.dart';

class CafeDetailPage extends Page {
  final CafeModel cafe;

  CafeDetailPage({required this.cafe});

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
        settings: this,
        builder: (BuildContext context) {
          return CafeDetailScreen(cafe: cafe);
        });
  }
}

class CafeDetailScreen extends StatelessWidget {
  final CafeModel cafe;

  CafeDetailScreen({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: Header(), body: Text(cafe.name));
  }
}
