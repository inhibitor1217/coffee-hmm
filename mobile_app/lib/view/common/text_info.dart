import 'package:flutter/material.dart';

class TextInfo extends StatelessWidget {
  final String text;
  final double? fontSize;
  final Function()? onPressed;

  TextInfo({required this.text, this.fontSize, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: Text(text,
          style: TextStyle(
            color: Colors.black,
            fontSize: fontSize ?? 13,
            height: 1.2,
          )),
      onTap: onPressed,
    );
  }
}
