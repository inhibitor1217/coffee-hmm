import 'package:flutter/material.dart';

class CafeName extends StatelessWidget {
  final String name;

  CafeName({required this.name});

  @override
  Widget build(BuildContext context) {
    return Text(
      name,
      style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
    );
  }
}
