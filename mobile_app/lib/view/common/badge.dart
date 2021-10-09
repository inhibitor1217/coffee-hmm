import 'package:flutter/material.dart';

class Badge extends StatelessWidget {
  final String text;
  final BoxDecoration? decoration;

  Badge({required this.text, this.decoration});

  @override
  Widget build(BuildContext context){
    return Container(
      child: Center(
          child: Text(
            text,
            style: TextStyle(fontSize: 8, color: Colors.white, fontWeight: FontWeight.bold),
          )),
      constraints: BoxConstraints(minHeight: 15, minWidth: 15),
      padding: EdgeInsets.symmetric(horizontal: 4),
      decoration: decoration,
    );
  }
}