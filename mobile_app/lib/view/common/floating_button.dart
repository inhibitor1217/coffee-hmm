import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';

class FloatingButton extends StatelessWidget {
  final String title;
  final Function() onPressed;

  FloatingButton({required this.title, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width,
      height: 72,
      padding: EdgeInsets.only(left: 20, right: 20, top: 12, bottom: 20),
      decoration: BoxDecoration(color: Palette.whiteTransparentBG),
      child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            primary: Palette.highlightedColor,
            onPrimary: Colors.white,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          child: Text(title),
          onPressed: onPressed),
    );
  }
}
