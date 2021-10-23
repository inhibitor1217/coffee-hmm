import 'package:flutter/material.dart';

class CafeName extends StatelessWidget {
  final String name;
  final TextStyle customStyle;

  CafeName({required this.name, required this.customStyle});

  @override
  Widget build(BuildContext context) {
    return Text(
      name,
      style: customStyle,
    );
  }
}

extension CafeNameStyles on CafeName {
  static TextStyle mainStyle = TextStyle(fontSize: 14, fontWeight: FontWeight.bold);
  static TextStyle detailStyle = TextStyle(fontSize: 18, fontWeight: FontWeight.bold);
}
